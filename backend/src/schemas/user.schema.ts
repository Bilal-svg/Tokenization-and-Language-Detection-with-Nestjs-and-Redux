import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string; // Add name field

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string; // Optional for guest users

  @Prop({ default: 'user' })
  role: string; // Default is 'user'
}

export const UserSchema = SchemaFactory.createForClass(User);
