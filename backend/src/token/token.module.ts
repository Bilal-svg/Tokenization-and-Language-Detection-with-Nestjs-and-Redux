import { Module } from '@nestjs/common';
import { TokenController } from './token.controller.js';
import { TokenService } from './token.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Text, TextSchema } from '../schemas/text.schema.js';
import { TextValidationGuard } from './gaurds/validation.gaurd.js';
import { UsersModule } from '../users/users.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Text.name, schema: TextSchema }]),
    UsersModule,
    AuthModule,
  ],
  controllers: [TokenController],
  providers: [TokenService, TextValidationGuard],
})
export class TokenModule {}
