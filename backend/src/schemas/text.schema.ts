import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Text extends Document {
  @Prop({ required: true, unique: true })
  text: string;

  @Prop({ required: true, default: 0 })
  count: number;

  @Prop({ required: true, default: '' })
  filePath: string;

  @Prop({ required: true, default: '' })
  languages: string;

  @Prop({ required: true, default: '' })
  role: string;

  @Prop({ required: true, default: '' })
  sub: string;

  @Prop({ required: true, default: false })
  flagged: boolean;
}

export const TextSchema = SchemaFactory.createForClass(Text);
