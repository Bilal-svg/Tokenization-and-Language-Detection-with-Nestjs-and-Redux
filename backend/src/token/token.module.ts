import { Module } from '@nestjs/common';
import { TokenController } from './token.controller.js';
import { TokenService } from './token.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Text, TextSchema } from '../schemas/text.schema.js';
import { TextValidationGuard } from './gaurds/validation.gaurd.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Text.name, schema: TextSchema }]),
  ],
  controllers: [TokenController],
  providers: [TokenService, TextValidationGuard],
})
export class TokenModule {}
