import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../schemas/games.schema';
import { GameService } from './services/game.service';
import { GameController } from './controllers/game.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]), 
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService, MongooseModule], 
})
export class GameModule {}