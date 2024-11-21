import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from './token/token.module.js';
import mongoose from 'mongoose';

mongoose.set('debug', true);

@Module({
  imports: [
    TokenModule,
    MongooseModule.forRoot('mongodb://localhost:27017/text_data', {
      connectionFactory: (connection) => {
        console.log(' Checking MongoDB connection...');
        connection.on('connected', () => {
          console.log(' MongoDB connected successfully');
        });
        connection.on('error', (err: any) => {
          console.error(' MongoDB connection error:', err);
        });
        return connection;
      },
    }),
  ],
})
export class AppModule {}
