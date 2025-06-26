import { useEffect, useState } from 'react';
import { makeMove, resetGame, initializeBoard } from '../../lib/api';
import GameBoard from '../Board/GameBoard';
import GameMenu from '../Menu/GameMenu';
import { useRouter } from 'next/router';
import styles from './Game.module.css'; './board.module.css'; './Menu.module.css';
import { Group } from '@shakers/ui';

export default function Game() {
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [size, setSize] = useState(3);
  const router = useRouter();

  useEffect(() => {
    fetchBoard();
  }, [size]);

  async function fetchBoard() {
    const data = await initializeBoard(size);
    setBoard(data.board);
    setCurrentPlayer(data.currentPlayer);
    setWinner(null);
    setDraw(false);
  }

  async function handleSquareClick(index) {
    if (board[index] || winner || draw) return;
    let data = await makeMove(index);
    setBoard(data.board);
    setWinner(data.winner);
    setDraw(data.draw);
    setCurrentPlayer(data.winner ? currentPlayer : currentPlayer === 'X' ? 'O' : 'X');
  }

  function handleSizeChange(value) {
    setSize(parseInt(value, 10));
  }

  async function handleReset() {
    const data = await resetGame();
    setBoard(data);
    setWinner(null);
    setDraw(false);
    setCurrentPlayer('X');
  }

  function handleReturnLobby() {
    router.push('/lobby');
  }

  return (
    <div className={styles.localContainer}> 
      <div className= {styles.logoShakersGames}>
        <img 
          src="/letter.png"
          alt="Game Logo" 
          className="game-logo"
          onClick={handleReturnLobby}
        />
      </div>

      <h1 className= {styles.h1Titles}>Tic Tac Toe - Local Mode</h1>

      <div className={styles.gameContainer}>

        <Group gap={220} mt={70}>
          <GameMenu
            mode="local"
            size={size}
            onSizeChange={handleSizeChange}
            winner={winner}
            draw={draw}
            currentPlayer={currentPlayer}
            onReset={handleReset}
            onReturnLobby={handleReturnLobby}
          />
          
          <div className= {styles.boardContainer}>
            <GameBoard board={board} onSquareClick={handleSquareClick} size={size} />
          </div>

          <div className= {styles.shakersAI}>
            <img 
              src="/shakers-ai-cartel.png" 
              alt="Shakers AI Cartel" 
              className={styles.AIShakers}
              onClick={() => window.open("https://www.shakersworks.com/shakers_ai_betatester", "_blank")}
            />
          </div>
        </Group>

      </div>
    </div>
  );
}