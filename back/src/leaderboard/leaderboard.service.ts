import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from '../schemas/games.schema';
import { User, UserDocument } from '../schemas/users.schema';

export interface LeaderboardEntry { 
  username: string;
  wins: number;
}

@Injectable()
export class LeaderboardService { 
  constructor( 
    @InjectModel(Game.name) private gameModel: Model<GameDocument>, 
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const games = await this.gameModel.find(); 
    const leaderboard = new Map<string, number>(); 
    games.forEach(game => { 
      if (game.winner) {
        leaderboard.set(game.winner.toString(), (leaderboard.get(game.winner.toString()) || 0) + 1); 
      }
    });

    const userIds = Array.from(leaderboard.keys()); 
    const users = await this.userModel.find({ _id: { $in: userIds } }); 
    const userMap = new Map(users.map(user => [user._id.toString(), user.username])); 

    return Array.from(leaderboard.entries()) 
      .map(([userId, wins]) => ({ 
        username: userMap.get(userId) || 'Unknown', 
        wins 
      }))
      .sort((a, b) => b.wins - a.wins); 
  }
}