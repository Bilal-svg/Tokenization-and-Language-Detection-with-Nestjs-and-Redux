import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Text } from '../schemas/text.schema.js';
import { User } from '../schemas/user.schema.js';
import { tokenizeText } from './utils/tokenizer.util.js';
import { generatePDF } from './utils/pdfGenerator.util.js';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Text.name) private readonly textModel: Model<Text>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async processText(text: string, role: string, sub: string) {
    const token = tokenizeText(text);
    const { tokens, count, languages } = token;

    const { fileName, filePath } = await generatePDF(text);

    const savedText = await this.textModel.findOneAndUpdate(
      { text },
      { text, filePath, languages, count, role, sub },
      { new: true, upsert: true },
    );

    return { fileName, filePath, count, tokens, savedText, languages };
  }

  async getPaginatedSavedTexts(
    page: number,
    limit: number,
    search: string,
    sortOrder: string,
    userId: string | null,
    role: string | null,
  ) {
    const queryConditions: any = {};

    if (search) {
      queryConditions.text = { $regex: search, $options: 'i' };
    }

    console.log('🚀 ~ TokenService ~ role:', role);
    // Role-based conditions
    if (role === 'admin') {
      // Admins can see all posts
    } else if (role === 'guest') {
      // Guests can only see other guest posts
      queryConditions['role'] = 'guest';
    } else if (role === 'user') {
      // Users can see their own posts or all guest posts
      queryConditions.$or = [
        { sub: userId }, // User's own posts
        { role: 'guest' }, // All guest posts
      ];
    }
    console.log('🚀 ~ TokenService ~ queryConditions:', queryConditions);

    const texts = await this.textModel
      .find(queryConditions)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: sortOrder === 'newest' ? -1 : 1 }) // Sort based on order
      .exec();

    // Use the length of the 'texts' array for the total count
    const totalCount = await this.textModel
      .countDocuments(queryConditions)
      .exec();

    console.log('🚀 ~ TokenService ~ texts:', texts);
    return { texts, totalCount };
  }
}
