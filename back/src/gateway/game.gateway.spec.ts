import { Test, TestingModule } from '@nestjs/testing';
import { GameGateway } from './game.gateway';
import { GameService } from '../game/services/game.service';
import { Server, Socket } from 'socket.io';

describe('GameGateway', () => {
  let gateway: GameGateway;
  let gameService: GameService;
  let mockServer: Partial<Server>;

  beforeEach(async () => {
    mockServer = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    } as Partial<Server>;

    const mockGameService = {
      initBoard: jest.fn().mockReturnValue(Array(9).fill(null)),
      makeMove: jest.fn().mockReturnValue({ board: Array(9).fill(null), winner: null, draw: false }),
      resetGame: jest.fn().mockReturnValue(Array(9).fill(null)),
      endGame: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameGateway,
        { provide: GameService, useValue: mockGameService },
      ],
    }).compile();

    gateway = module.get<GameGateway>(GameGateway);
    gameService = module.get<GameService>(GameService);
    gateway.server = mockServer as Server;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleCreateGame', () => {
    it('should create a game and emit gameCreated', () => {
      const mockClient = { emit: jest.fn(), handshake: { query: { userID: 'user1' } } } as unknown as Socket;
      gateway.handleCreateGame(mockClient);
      expect(mockClient.emit).toHaveBeenCalledWith('gameCreated', expect.any(Object));
    });

    it('should return error if userID is missing', () => {
      const mockClient = { emit: jest.fn(), handshake: { query: {} } } as unknown as Socket;
      gateway.handleCreateGame(mockClient);
      expect(mockClient.emit).toHaveBeenCalledWith('error', { message: 'UserID is required!' });
    });
  });

  describe('handleJoinGame', () => {
    it('should allow a player to join a game and start if two players join', () => {
      const gameId = 'test123';
      gateway["games"].set(gameId, {
        id: gameId,
        board: Array(9).fill(null),
        players: ['player1'],
        playerIds: ['user1'],
        turn: 'X',
        symbols: { player1: 'X' },
        winner: null,
        draw: false,
        rematchRequests: new Set(),
      });

      const mockClient = { id: 'player2', emit: jest.fn(), handshake: { query: { userID: 'user2' } } } as unknown as Socket;
      gateway.handleJoinGame(mockClient, gameId);
      expect(mockServer.to).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should return error if game does not exist', () => {
      const mockClient = { emit: jest.fn(), handshake: { query: { userID: 'user2' } } } as unknown as Socket;
      gateway.handleJoinGame(mockClient, 'invalidGame');
      expect(mockClient.emit).toHaveBeenCalledWith('error', { message: 'Game not found!' });
    });
  });

  describe('handleMakeMove', () => {
    it('should process a move and update game state', async () => {
      const gameId = 'test123';
      gateway["games"].set(gameId, {
        id: gameId,
        board: Array(9).fill(null),
        players: ['player1', 'player2'],
        playerIds: ['user1', 'user2'],
        turn: 'X',
        symbols: { player1: 'X', player2: 'O' },
        winner: null,
        draw: false,
        rematchRequests: new Set(),
      });

      const mockClient = { id: 'player1', emit: jest.fn() } as unknown as Socket;
      await gateway.handleMakeMove(mockClient, { gameId, index: 0 });

      expect(gameService.makeMove).toHaveBeenCalledWith(0);
      expect(mockServer.to).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should prevent moves in an already won game', async () => {
      const gameId = 'test123';
      gateway["games"].set(gameId, {
        id: gameId,
        board: Array(9).fill(null),
        players: ['player1', 'player2'],
        playerIds: ['user1', 'user2'],
        turn: 'X',
        symbols: { player1: 'X', player2: 'O' },
        winner: 'X',
        draw: false,
        rematchRequests: new Set(),
      });

      const mockClient = { id: 'player2', emit: jest.fn() } as unknown as Socket;
      await gateway.handleMakeMove(mockClient, { gameId, index: 1 });

      expect(mockClient.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleAbandonGame', () => {
    it('should declare the opponent as winner when a player abandons', () => {
      const gameId = 'test123';
      gateway["games"].set(gameId, {
        id: gameId,
        board: Array(9).fill(null),
        players: ['player1', 'player2'],
        playerIds: ['user1', 'user2'],
        turn: 'X',
        symbols: { player1: 'X', player2: 'O' },
        winner: null,
        draw: false,
        rematchRequests: new Set(),
      });

      const mockClient = { id: 'player1', emit: jest.fn() } as unknown as Socket;
      gateway.handleAbandonGame(mockClient, gameId);

      expect(mockServer.to).toHaveBeenCalledWith('player2');
      expect(mockServer.emit).toHaveBeenCalledWith('playerAbandoned', { winner: 'O' });
    });
  });

  describe('handleRequestRematch', () => {
    it('should handle rematch request and start a new game if both players agree', () => {
      const gameId = 'test123';
      gateway["games"].set(gameId, {
        id: gameId,
        board: Array(9).fill(null),
        players: ['player1', 'player2'],
        playerIds: ['user1', 'user2'],
        turn: 'X',
        symbols: { player1: 'X', player2: 'O' },
        winner: 'X',
        draw: false,
        rematchRequests: new Set(),
      });

      const mockClient = { id: 'player1', emit: jest.fn() } as unknown as Socket;
      gateway.handleRequestRematch(mockClient, gameId);

      expect(mockServer.to).toHaveBeenCalledWith('player2');
      expect(mockServer.emit).toHaveBeenCalledWith('rematchRequested');
    });
  });
});