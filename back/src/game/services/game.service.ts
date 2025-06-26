import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from '../../schemas/games.schema';


export type Player = 'X' | 'O';
export type Board = (Player | null)[];

@Injectable()
export class GameService {
  private board: Board = [];
  private xTurn: boolean = true;
  private size: number = 3;
  private winCondition: number = 3;
  private difficulty: number = 0.83; 
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}
  private rematchRequests: { [key: string]: boolean } = {}; 
  public getBoard(): Board {
    return this.board;
  }
  public getTurn(): boolean {
    return this.xTurn;
  }

  initBoard(size: number): Board {
    this.size = size;
    this.winCondition = size;
    this.board = Array(size * size).fill(null);
    this.xTurn = true;
    return this.board;
  }

  setDifficulty(difficulty: number): void {
    this.difficulty = difficulty;
  }

  getCurrentPlayer(): Player {
    return this.xTurn ? 'X' : 'O';
  }
  makeMove(position: number): { board: Board; winner: Player | null; draw: boolean; turn: Player } {
    if (position !== -1) {
      if (this.board[position] || this.checkWinner() || this.isDraw()) {
        return { 
          board: this.board, 
          winner: this.checkWinner(), 
          draw: this.isDraw(), 
          turn: this.getCurrentPlayer()
        };
      }
      this.board[position] = this.getCurrentPlayer();
    } else {
      this.makeCpuMove();
    }
  
    this.xTurn = !this.xTurn;
    return {
      board: this.board,
      winner: this.checkWinner(),
      draw: this.isDraw(),
      turn: this.getCurrentPlayer(), 
    };
  }

  public makeCpuMove() {
    let bestScore = -Infinity; 
    let bestMove = -1; 
    const cpu = this.getCurrentPlayer(); 
    const human = cpu === 'X' ? 'O' : 'X'; 

    const randomFactor = Math.random();
    if (randomFactor > this.difficulty) { 
      const availableMoves = this.board 
        .map((cell, idx) => (cell === null ? idx : null)) 
        .filter((idx) => idx !== null); 
      if (availableMoves.length > 0) { 
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]; 
        this.board[randomMove] = cpu; 
        return;
      }
    } else {
    }

    for (let i = 0; i < this.board.length; i++) { 
      if (this.board[i] === null) { 
        this.board[i] = cpu; 
        let score = this.minimax(this.board, 0, false, cpu, human);
        this.board[i] = null; 

        if (score > bestScore) { 
          bestScore = score; 
          bestMove = i; 
        }
      }
    }

    if (bestMove !== -1) { 
      this.board[bestMove] = cpu; 
    }
  }

  private minimax(board: Board, depth: number, isMaximizing: boolean, cpu: Player, human: Player): number {
    let winner = this.checkWinner();
    
    if (winner === cpu) return 10 - depth;
    if (winner === human) return depth - 10;
    if (this.isDraw()) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = cpu;
          let score = this.minimax(board, depth + 1, false, cpu, human);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = human;
          let score = this.minimax(board, depth + 1, true, cpu, human);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  private checkWinner(): Player | null {
    const directions = [
      [1, 0],  
      [0, 1],  
      [1, 1],  
      [1, -1], 
    ];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const index = row * this.size + col;
        const player = this.board[index];
        if (!player) continue;

        for (const [dx, dy] of directions) {
          let count = 1;
          let x = row + dx;
          let y = col + dy;

          while (
            x >= 0 &&
            x < this.size &&
            y >= 0 &&
            y < this.size &&
            this.board[x * this.size + y] === player
          ) {
            count++;
            if (count === this.winCondition) return player;
            x += dx;
            y += dy;
          }
        }
      }
    }
    return null;
  }

  private isDraw(): boolean {
    return this.board.every((cell) => cell !== null) && !this.checkWinner();
  }

  requestRematch(player: Player): boolean {
    const otherPlayer = player === 'X' ? 'O' : 'X';

    this.rematchRequests[player] = true;

    if (this.rematchRequests['X'] && this.rematchRequests['O']) {
      this.resetGame();
      this.rematchRequests = {};  
      return true;  
    }

    return false; 
  }

  resetGame(): Board {
    return this.initBoard(this.size);
  }
  async endGame(user1Id: string, user2Id: string, winnerId: string | null) {
    const draw = winnerId === null;
    const loserId = draw ? null : (winnerId === user1Id ? user2Id : user1Id);

    const game = new this.gameModel({
      user1: user1Id,
      user2: user2Id,
      winner: winnerId,
      loser: loserId,
      draw,
    });

    await game.save();
    console.log('Game result saved:', game);
  }
}
