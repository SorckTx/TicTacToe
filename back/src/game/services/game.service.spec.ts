import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { getModelToken } from '@nestjs/mongoose';

describe('GameService', () => {
  let service: GameService;

  const mockGameModel = { 
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getModelToken('Game'),
          useValue: mockGameModel,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);


    (service as any).board = Array(9).fill(null);
  });

  it('should be defined', () => { 
    expect(service).toBeDefined();
  });

  it('should make a move and update the board', () => { 
    const position = 0;  
    service.makeMove(position);
    expect(service.getBoard()[position]).toBe('X');
    expect(service.getTurn()).toBe(false);
  });

  it('should not allow a move if position is occupied', () => { 
    service.makeMove(0);
    const result = service.makeMove(0);

    expect(service.getBoard()[0]).toBe('X');
    expect(result.winner).toBe(null);
  });

  it('should detect a winner', () => { 
    (service as any).board = ['X', 'X', 'X', null, null, null, null, null, null];
    const result = service.makeMove(3); 

    expect(result.winner).toBe('X');
  });

  it('should detect a draw', () => {
    (service as any).board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];

    const result = service.makeMove(3);

    expect(result.draw).toBe(true);
  });

  it('should call makeCpuMove when position is -1', () => {
    const spy = jest.spyOn(service as any, 'makeCpuMove');

    service.makeMove(-1);

    expect(spy).toHaveBeenCalled();
  });
});