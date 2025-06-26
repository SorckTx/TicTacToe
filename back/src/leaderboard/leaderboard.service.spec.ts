import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardService } from './leaderboard.service';
import { getModelToken } from '@nestjs/mongoose';
import { Game } from '../schemas/games.schema';
import { User } from '../schemas/users.schema';

describe('LeaderboardService', () => {
  let leaderboardService: LeaderboardService;

  const mockGameModel = {
    find: jest.fn().mockResolvedValue([
      { winner: 'user1' },
      { winner: 'user2' },
      { winner: 'user1' },
      { winner: 'user3' },
      { winner: 'user1' },
      { winner: 'user3' },
    ]), 
  };

  const mockUserModel = {
    find: jest.fn().mockResolvedValue([
      { _id: 'user1', username: 'PlayerOne' },
      { _id: 'user2', username: 'PlayerTwo' },
      { _id: 'user3', username: 'PlayerThree' },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardService,
        { provide: getModelToken(Game.name), useValue: mockGameModel },
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    leaderboardService = module.get<LeaderboardService>(LeaderboardService);
  });

  it('should be defined', () => {
    expect(leaderboardService).toBeDefined();
  });

  it('should return a sorted leaderboard', async () => {
    const leaderboard = await leaderboardService.getLeaderboard();

    expect(leaderboard).toEqual([
      { username: 'PlayerOne', wins: 3 },
      { username: 'PlayerThree', wins: 2 },
      { username: 'PlayerTwo', wins: 1 },
    ]);
  });

  it('should handle users that are not found in the database', async () => {
    mockUserModel.find.mockResolvedValueOnce([
      { _id: 'user1', username: 'PlayerOne' },
      { _id: 'user3', username: 'PlayerThree' },
    ]);

    const leaderboard = await leaderboardService.getLeaderboard();

    expect(leaderboard).toEqual([
      { username: 'PlayerOne', wins: 3 },
      { username: 'PlayerThree', wins: 2 },
      { username: 'Unknown', wins: 1 }, // Usuario no encontrado
    ]);
  });
});