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
}

export const TextSchema = SchemaFactory.createForClass(Text);
