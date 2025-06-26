import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

describe('LeaderboardController', () => {
  let leaderboardController: LeaderboardController;
  let leaderboardService: LeaderboardService;

  // Mockeamos LeaderboardService
  const mockLeaderboardService = {
    getLeaderboard: jest.fn().mockResolvedValue([
      { username: 'Player1', wins: 10 },
      { username: 'Player2', wins: 7 },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardController],
      providers: [
        { provide: LeaderboardService, useValue: mockLeaderboardService }, // Mockeamos el servicio
      ],
    }).compile();

    leaderboardController = module.get<LeaderboardController>(LeaderboardController);
    leaderboardService = module.get<LeaderboardService>(LeaderboardService);
  });

  it('should be defined', () => {
    expect(leaderboardController).toBeDefined();
  });

  it('should return leaderboard data', async () => {
    const result = await leaderboardController.getLeaderboard();
    
    expect(result).toEqual([
      { username: 'Player1', wins: 10 },
      { username: 'Player2', wins: 7 },
    ]);

    expect(leaderboardService.getLeaderboard).toHaveBeenCalled();
  });
});