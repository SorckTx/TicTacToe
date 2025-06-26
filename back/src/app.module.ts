import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GameGateway } from './gateway/game.gateway';
import { GameService } from './game/services/game.service';
import { ConfigModule } from '@nestjs/config';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
@Module({
  imports: [
    GameModule,
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({isGlobal: true}),
    LeaderboardModule,
  ],
  providers: [GameGateway, GameService],
})
export class AppModule {}