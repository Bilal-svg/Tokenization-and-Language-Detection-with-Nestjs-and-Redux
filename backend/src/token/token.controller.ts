import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Query,
  UseGuards,
  Header,
  Param,
} from '@nestjs/common';
import { TokenService } from './token.service.js';
import { AuthGuard } from '../auth/auth.gaurd.js';
import { Response } from 'express';
import * as fs from 'fs';
import path from 'path';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('process')
  @UseGuards(AuthGuard)
  async processText(@Body() body: { text: string }, @Res() res: Response) {
    try {
      const { role, sub } = res.locals.user;
      const { text } = body;
      const { filePath, count, tokens, languages, savedText } =
        await this.tokenService.processText(text, role, sub);
      return res
        .status(HttpStatus.OK)
        .json({ filePath, count, tokens, languages, savedText });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

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
  @UseGuards(AuthGuard)
  async getSavedTexts(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('sortOrder') sortOrder: string,
    @Res() res: Response,
  ) {
    try {
      const { role, sub } = res.locals.user;

      let userId = null;

      if (role === 'admin') {
        userId = null;
      } else if (role === 'user') {
        userId = sub;
      } else if (role === 'guest') {
        userId = null;
      }

      const { texts, totalCount } =
        await this.tokenService.getPaginatedSavedTexts(
          parseInt(page) || 1,
          parseInt(limit) || 10,
          search || '',
          sortOrder || 'newest',
          userId,
          role,
        );

      return res.status(HttpStatus.OK).json({ texts, totalCount });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
