import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardEntry } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.leaderboardService.getLeaderboard();
  }
}
