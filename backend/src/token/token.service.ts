import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Text } from '../schemas/text.schema.js';
import { tokenizeText } from './utils/tokenizer.util.js';

import { generatePDF } from './utils/pdfGenerator.util.js';
import { TextValidationGuard } from './gaurds/validation.gaurd.js';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Text.name) private readonly textModel: Model<Text>,
  ) {}

  async processText(text: string) {
    // // Validate the input text
    // const validation = this.validate.validateText(text);
    // if (validation.valid == false) {
    //   throw new Error(validation.error);
    // }

    // Tokenize the text
    const token = tokenizeText(text);
    const { tokens, count, languages } = token;
    console.log('🚀 ~ TokenService ~ processText ~ count:', count);

    // Generate the PDF and get the word/character count
    const { fileName, filePath } = await generatePDF(text);
    console.log('🚀 ~ TokenService ~ processText ~ filePath:', filePath);

    // Save the text and count to the database
    const savedText = await this.textModel.findOneAndUpdate(
      { text },
      { text, filePath, languages, count },
      { new: true, upsert: true },
    );

    return { fileName, filePath, count, tokens, savedText, languages };
  }

  async getPaginatedSavedTexts(
    page: number,
    limit: number,
    search: string,
    sortOrder: string,
  ): Promise<{ texts: Text[]; totalCount: number }> {
    const query: Record<string, any> = {};

    // Add search filter if a search term is provided
    if (search) {
      query['text'] = { $regex: search, $options: 'i' };
    }

    // Determine sort order
    const sort: { [key: string]: SortOrder } = {
      createdAt: sortOrder === 'oldest' ? 1 : -1,
    };

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Perform the query with filtering, sorting, and pagination
    const texts = await this.textModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    // Get the total count of matching documents
    const totalCount = await this.textModel.countDocuments(query).exec();
    console.log('🚀 ~ TokenService ~ totalCount:', totalCount);

    return { texts, totalCount };
  }
}
