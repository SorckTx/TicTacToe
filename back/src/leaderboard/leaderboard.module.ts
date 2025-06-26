import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../schemas/games.schema';
import { User, UserSchema } from '../schemas/users.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  providers: [LeaderboardService],
  controllers: [LeaderboardController]
})
export class LeaderboardModule {}
