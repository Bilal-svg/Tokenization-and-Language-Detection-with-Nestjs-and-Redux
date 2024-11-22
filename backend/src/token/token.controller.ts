import {
  Query,
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Header,
  UseGuards,
} from '@nestjs/common';
import { TokenService } from './token.service.js';
import { Response } from 'express';
import path from 'path';
import * as fs from 'fs';
import { TextValidationGuard } from './gaurds/validation.gaurd.js';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('process')
  @UseGuards(TextValidationGuard)
  async processText(@Body() body: { text: string }, @Res() res: Response) {
    try {
      const { text } = body;
      const { filePath, count, tokens, languages, savedText } =
        await this.tokenService.processText(text);
      return res
        .status(HttpStatus.OK)
        .json({ filePath, count, tokens, languages, savedText });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint to serve the PDF file for download
  @Get('download/:fileName')
  @Header('Content-Type', 'application/pdf')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  async downloadPDF(@Param('fileName') fileName: string, @Res() res: Response) {
    try {
      const filePath = path.join(
        process.cwd(),
        'public',
        'pdfs',
        fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
      );

      if (!fs.existsSync(filePath)) {
        console.log('🚀 File does not exist at:', filePath);
        return res.status(404).send('File not found');
      }

      const file = fs.createReadStream(filePath);

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${path.basename(filePath)}"`,
      );
      file.pipe(res);
    } catch (error) {
      console.error('🚀 Error during file download:', error);
      res.status(500).send('Error while downloading the file');
    }
  }

  @Get('saved-texts')
  async getSavedTexts(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('sortOrder') sortOrder: string,
    @Query('filePath') filePath: string,
    @Res() res: Response,
  ) {
    try {
      const { texts, totalCount } =
        await this.tokenService.getPaginatedSavedTexts(
          parseInt(page) || 1,
          parseInt(limit) || 10,
          search || '',
          sortOrder || 'newest',
        );

      return res.status(HttpStatus.OK).json({ texts, totalCount });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }
}
