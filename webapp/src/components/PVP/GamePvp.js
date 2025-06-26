import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import GameBoard from '../Board/GameBoard';
import { useRouter } from "next/router";
import { getUserIDFromToken } from "@/lib/auth";
import styles from './Pvp.module.css'; './board.module.css'; './Menu.module.css'
import { Group , Button} from '@shakers/ui';
import { IconUserPlus, IconPlus, IconPlugConnected, IconLink, IconPlugConnectedX, IconDoorExit, IconRefresh, IconCircleCheck } from '@tabler/icons-react';


export default function GamePvp() {
  const [message, setMessage] = useState("Press connect to play");
  const [socket, setSocket] = useState(null);
  const [gameId, setGameId] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [waitingForPlayer, setWaitingForPlayer] = useState(false);
  const [rematchRequested, setRematchRequested] = useState(false);
  const [opponentWantsRematch, setOpponentWantsRematch] = useState(false);
  const [gameAbandoned, setGameAbandoned] = useState(false);
  const [gameIdError, setGameIdError] = useState(false);
  const router = useRouter();
  const [userID, setUserID] = useState(null);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const userID = getUserIDFromToken();
      setUserID(userID);
      console.log("User ID obtenido del token:", userID);
    }
    
    if (socket) {
      socket.on("rematchRequested", () => {
        setOpponentWantsRematch(true);
      });

      socket.on("rematchAccepted", () => {
        resetGame();
      });

      socket.on("playerAbandoned", ({ winner }) => {
        if (winner === playerSymbol) {
          setMessage("Your opponent left the game. You win! 🎉");
          setWinner(playerSymbol);
        }
      });
      
      socket.on("error", ({ message }) => {
        if (message === "Game not found!") {
          setGameIdError(true);
          setMessage("Game ID invalid");
        } else {
          setMessage(message);
        }
      });
    }
  }, [socket, playerSymbol]);

  const connectToServer = () => {
    if (!socket) {
      const newSocket = io("http://localhost:8000", {
        transports: ["websocket"],
        query: { userID }, 
      });

      newSocket.on("connect", () => {
        setMessage("Connected to WebSocket server");
      });

      newSocket.on("gameCreated", ({ gameId }) => {
        setGameId(gameId);
        setMessage(`Game created. ID: ${gameId}`);
        setWaitingForPlayer(true);
      });

      newSocket.on("playerJoined", ({ players }) => {
        setMessage(`Players in the game: ${players.length}`);
        setWaitingForPlayer(false);
      });

      newSocket.on("assignSymbols", (symbols) => {
        setPlayerSymbol(symbols[newSocket.id]);
        setMessage(`You are player: ${symbols[newSocket.id]}`);
      });

      newSocket.on("startGame", () => {
        setGameStarted(true);
        setMessage("The game has started!");
      });

      newSocket.on("updateBoard", ({ board, turn, winner, draw }) => {
        setBoard(board);
        setTurn(turn);
        setWinner(winner);
        setDraw(draw);
      });
      newSocket.on("yourTurn", (data) => {
        setMessage(data.message);
      });
      newSocket.on("waitingTurn", (data) => {
        setMessage(data.message); 
      });
      newSocket.on("disconnect", () => {
        setMessage("Disconnected from WebSocket server");
      });
      newSocket.on("gameEnded", () => {
        setWaitingForPlayer(false); 
        setTurn(null); 
        setMessage("Game Over!"); 
      });
      setSocket(newSocket);
    }
  };

  const handleJoinGameClick = () => {
    setShowInput(true);
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setMessage("Disconnected from WebSocket server");
      setGameStarted(false);
      setWaitingForPlayer(false);
      router.push("/lobby");
    }
  };

  const handleJoin = () => {
    if (socket && gameId.trim()) {
      socket.emit("joinGame", gameId.trim());
    }
  };

  const requestRematch = () => {
    if (socket) {
      setRematchRequested(true);
      socket.emit("requestRematch", gameId);
      setMessage("Rematch requested! Waiting for opponent...");
    }
  };

  const acceptRematch = () => {
    if (socket) {
      socket.emit("acceptRematch", gameId);
      setMessage("Rematch accepted! Starting new game...");
    }
  };

  const abandonGame = () => {
    if (socket && gameId && !winner && !draw) {
      if (window.confirm("Are you sure you want to leave the game? You will lose by forfeit.")) {
        socket.emit("abandonGame", gameId);
        setGameAbandoned(true);
        setMessage("You left the game. Your opponent wins!");
        setWinner(playerSymbol === "X" ? "O" : "X");
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setDraw(false);
    setTurn("X");
    setGameStarted(true);
    setRematchRequested(false);
    setOpponentWantsRematch(false);
    setGameAbandoned(false);
    setMessage("Rematch started! Good luck!");
  };
  
  const joinGame = () => {
    if (socket) {
      setGameIdError(false); 
      socket.emit("joinGame", gameId);
    }
  };

  return (
    <div className={styles.pvpContainer}>
      <div className={styles.pvpLogo}>
        <img 
          src="/letter.png" 
          alt="Game Logo" 
          className="game-logo"
          onClick={() => router.push('/lobby')}
        />
      </div>

      <h1 className={styles.titlePvp}>TIC TAC TOE PVP</h1>
      <p className={`pvp-message ${gameIdError ? "error-message" : ""}`}>{message}</p>

      {winner && (
        <div className={styles.gameResultPvp}>
          <p style={{ color: winner === playerSymbol ? "green" : "red", fontWeight: "bold" }}>
            {winner === playerSymbol ? "You won!" : gameAbandoned ? "You forfeited the game" : "You lost..."}
          </p>
          <div className={styles.rematch}>
            {!rematchRequested && !opponentWantsRematch && (
              <Button color="white" leftIcon={<IconRefresh/>} onClick={requestRematch}>Request Rematch</Button>
            )}
            {opponentWantsRematch && !rematchRequested && (
              <Button color="lime" leftIcon={<IconCircleCheck/>} onClick={acceptRematch}>Accept Rematch</Button>
            )}
            {rematchRequested && !opponentWantsRematch && (
              <p className={styles.waitingMessage}>Waiting for opponent to accept rematch...</p>
            )}
          </div>
        </div>
      )}

      {!socket ? (
        <Button leftIcon={<IconPlugConnected/>} color="white" size="lg" mt={20} className={styles.connectButton} onClick={connectToServer}>Connect</Button>
      ) : (
        <>
          {!gameStarted && (
            <>
              <div className={styles.gameActions}>

                <Group gap={50}>
                  <Button color="white" leftIcon={<IconPlus />} onClick={() => socket.emit("createGame")}>Create Game </Button>
                  <Button color="white" leftIcon={<IconUserPlus/>} onClick={handleJoinGameClick}>Join Game</Button>
                </Group>

              </div>

              {showInput && (
                <div className={styles.joinGame}>
                  <input
                    type="text"
                    placeholder="Enter Game ID"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                  />
                  <Button color="yellow" size="md" leftIcon={<IconLink/>} onClick={handleJoin} className={styles.joinButton}>Join</Button>
                </div>
              )}

              <div className={styles.disconnectActions}>
                <Button color="white" w={160} h={40} mt={10} leftIcon={<IconPlugConnectedX/>} classNames={{root:styles.hoverDisconnect}} onClick={handleDisconnect}>Disconnect</Button>
              </div>
            </>
          )}
        </>
      )}

      {gameStarted && (
            <GameBoard 
              board={board} 
              onSquareClick={(index) => socket.emit("makeMove", { gameId, index })} 
              size={3} 
              disabled={turn !== playerSymbol || winner || draw} 
            />
      )}

      {gameStarted && !waitingForPlayer && !winner && !draw && (
        <div className={styles.gameControls}>
          <Button leftIcon={<IconDoorExit/>} color="red" mt={20} onClick={abandonGame}> Leave Game </Button>
        </div>
      )}
    </div>
  );
}

