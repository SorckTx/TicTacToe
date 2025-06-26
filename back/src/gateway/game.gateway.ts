import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { GameService } from '../game/services/game.service';

interface Game {
  id: string;
  board: (string | null)[];
  players: string[];
  playerIds: string[];
  turn: 'X' | 'O';
  symbols: Record<string, 'X' | 'O'>;
  winner: string | null;
  draw: boolean;
  rematchRequests: Set<string>;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private games: Map<string, Game> = new Map();

  constructor(private readonly gameService: GameService) {}

  private generateGameId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase(); 
    
  }

  private allPlayersRequestedRematch(game: Game): boolean {
    return game.rematchRequests.size === game.players.length;
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}, userID: ${client.handshake.query.userID}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    for (const [gameId, game] of this.games.entries()) {
      if (game.players.includes(client.id) && !game.winner && !game.draw) {
        this.handlePlayerAbandonGame(client, gameId);
      }
    }
  }

  @SubscribeMessage('createGame')
  handleCreateGame(client: Socket) {
    const userID = client.handshake.query.userID as string;
    if (!userID) {
      client.emit('error', { message: 'UserID is required!' });
      return;
    }
    
    const gameId = this.generateGameId();
    this.games.set(gameId, {
      id: gameId,
      board: this.gameService.initBoard(3),
      players: [client.id],
      playerIds: [userID],
      turn: 'X',
      symbols: {},
      winner: null,
      draw: false,
      rematchRequests: new Set()
    });

    client.emit('gameCreated', { gameId });
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(client: Socket, gameId: string) {
    const userID = client.handshake.query.userID as string;
    if (!userID) {
      client.emit('error', { message: 'UserID is required!' });
      return;
    }
    
    const game = this.games.get(gameId);
    if (!game) {
      client.emit('error', { message: 'Game not found!' });
      return;
    }
    
    if (game.players.length >= 2) {
      client.emit('error', { message: 'Game is full!' });
      return;
    }
    
    game.players.push(client.id); 
    game.playerIds.push(userID);
    game.symbols[game.players[0]] = 'X';
    game.symbols[game.players[1]] = 'O';
    
    game.players.forEach(playerId => {
      this.server.to(playerId).emit('playerJoined', {
        players: game.players,
        playerIds: game.playerIds
      });
      this.server.to(playerId).emit('assignSymbols', game.symbols);
    });
    
    if (game.players.length === 2) {
      this.server.to(game.players).emit('startGame');
      this.updateGameState(gameId);
    }
  }

  @SubscribeMessage('makeMove')
  async handleMakeMove(client: Socket, data: { gameId: string; index: number }) {
    const { gameId, index } = data; 
    const game = this.games.get(gameId);
  
    if (!game) {
      client.emit('error', { message: 'Game not found!' });
      return;
    }
  
    if (game.winner || game.draw) return; 
  
    if (game.symbols[client.id] !== game.turn) {
      client.emit('error', { message: 'Not your turn!' });
      return;
    }
  
    if (game.board[index] !== null) {
      client.emit('error', { message: 'Cell already taken!' });
      return;
    }
  
    const moveResult = this.gameService.makeMove(index); 
    game.board = moveResult.board;
    game.winner = moveResult.winner; 
    game.draw = moveResult.draw;
    game.turn = game.turn === 'X' ? 'O' : 'X';
  
    this.updateGameState(gameId);
  
    if (game.winner || game.draw) {
      this.server.to(game.players).emit("gameEnded");      
      const user1Id = game.playerIds[0];
      const user2Id = game.playerIds[1];
      const winnerId = game.winner ? (game.winner === 'X' ? user1Id : user2Id) : null;
  
      await this.gameService.endGame(user1Id, user2Id, winnerId);
    }
  }
  
  

  @SubscribeMessage('abandonGame')
  handleAbandonGame(client: Socket, gameId: string) {
    this.handlePlayerAbandonGame(client, gameId);
  }

  private handlePlayerAbandonGame(client: Socket, gameId: string) {
    const game = this.games.get(gameId);
    
    if (!game) {
      client.emit('error', { message: 'Game not found!' });
      return;
    }
    
    // Si el juego ya tiene un ganador o está empatado, no hacer nada
    if (game.winner || game.draw) {
      return;
    }
    
    const playerSymbol = game.symbols[client.id];
    
    if (!playerSymbol) {
      return;
    }
    
    // Encontrar al oponente
    const opponent = game.players.find(id => id !== client.id);
    
    if (opponent) {
      // Establecer al oponente como ganador
      const opponentSymbol = game.symbols[opponent];
      game.winner = opponentSymbol;
      
      // Notificar al oponente sobre el abandono
      this.server.to(opponent).emit('playerAbandoned', {
        winner: opponentSymbol
      });
      
      // Actualizar el estado del juego
      this.updateGameState(gameId);
    }
  }

  private updateGameState(gameId: string) {
    const game = this.games.get(gameId); 
    if (game) { 
      this.server.to(game.players).emit('updateBoard', { 
        board: game.board,
        turn: game.turn,
        winner: game.winner,
        draw: game.draw
      });
      const currentPlayer = game.players.find(player => game.symbols[player] === game.turn); 
      const lastPlayer = game.players.find(player => game.symbols[player] !== game.turn); 
        if (currentPlayer) {
            this.server.to(currentPlayer).emit('yourTurn', { message: "It's your turn!" });
        }
        if (lastPlayer) {
          this.server.to(lastPlayer).emit('waitingTurn', { message: "Waiting for your opponent..." });
      }
    }
  }

  @SubscribeMessage('requestRematch')
  handleRequestRematch(client: Socket, gameId: string) {
    const game = this.games.get(gameId);
    
    if (!game) {
      client.emit('error', { message: 'Game not found!' });
      return;
    }

    // Registrar la solicitud de revancha del jugador
    game.rematchRequests.add(client.id);
    
    // Notificar al otro jugador que se ha solicitado una revancha
    game.players.forEach(playerId => {
      if (playerId !== client.id) {
        this.server.to(playerId).emit('rematchRequested');
      }
    });
    
    // Comprobar si todos los jugadores han solicitado revancha
    if (this.allPlayersRequestedRematch(game)) {
      this.handleRematch(gameId);
    }
  }

  @SubscribeMessage('acceptRematch')
  handleAcceptRematch(client: Socket, gameId: string) {
    const game = this.games.get(gameId);
    
    if (!game) {
      client.emit('error', { message: 'Game not found!' });
      return;
    }
    
    // Registrar que este jugador ha aceptado la revancha
    game.rematchRequests.add(client.id);
    
    // Si todos los jugadores han aceptado la revancha, reiniciar el juego
    if (this.allPlayersRequestedRematch(game)) {
      this.handleRematch(gameId);
    }
  }

  private handleRematch(gameId: string) {
    const game = this.games.get(gameId);
    
    if (game) {
      // Reiniciar el tablero
      game.board = this.gameService.resetGame();
      game.winner = null;
      game.draw = false;
      game.turn = 'X';
      game.rematchRequests.clear(); // Limpiar las solicitudes de revancha
      
      // Notificar a los jugadores que la revancha ha sido aceptada
      this.server.to(game.players).emit('rematchAccepted');
      
      // Actualizar el estado del juego
      this.updateGameState(gameId);
    }
  }
}
