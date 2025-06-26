import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user1: Types.ObjectId; 

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user2: Types.ObjectId; 

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  winner: Types.ObjectId | null; 

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  loser: Types.ObjectId | null; 

  @Prop({ type: Boolean, default: false })
  draw: boolean; 
}

export const GameSchema = SchemaFactory.createForClass(Game);
