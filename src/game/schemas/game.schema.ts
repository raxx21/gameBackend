import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema({ timestamps: true })
export class Game {

  @Prop({ required: true })
  firstReleaseDate: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  updatedAt: string;

  @Prop({ required: true })
  publishedAt: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
