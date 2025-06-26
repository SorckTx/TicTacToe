import { Controller, Get, Post, Body } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { HttpCode } from '@nestjs/common';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('board')
  getBoard() {
    return {
      board: this.gameService.getBoard(),
      currentPlayer: this.gameService.getCurrentPlayer(),
    };
  }
  @Post('create')
  createGame(@Body() body: { mode: 'cpu' | 'pvp'; size?: number }) {
    const board = this.gameService.initBoard(body.size || 3); 
    return {
      message: 'Game created successfully',
      board,
      currentPlayer: this.gameService.getCurrentPlayer(),
    };
  }
  @Post('init')
  initializeBoard(@Body() body: { size: number }) {
    return {
      board: this.gameService.initBoard(body.size),
      currentPlayer: this.gameService.getCurrentPlayer(),
    };
  }

  @Post('move')
  @HttpCode(200)
  makeMove(@Body() body: { position: number; difficulty?: number }) {
    if (body.difficulty !== undefined) {
      this.gameService.setDifficulty(body.difficulty); 
    }
    return this.gameService.makeMove(body.position);
  }

  @Post('reset')
  resetGame() {
    return this.gameService.resetGame();
  }
}