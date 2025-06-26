import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { makeMove, resetGame, initializeBoard } from '../../lib/api';
import GameBoard from '../Board/GameBoard';
import GameMenu from '../Menu/GameMenu';
import styles from './Cpu.module.css'; './board.module.css'; './Menu.module.css';
import { Group } from '@shakers/ui';

export default function GameCpu() {
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [size, setSize] = useState(3); 
  const [difficulty, setDifficulty] = useState(0.83);
  const router = useRouter();

  useEffect(() => {
    fetchBoard();
  }, [size]);

  async function fetchBoard() {
    try {
      const data = await initializeBoard(size);
      setBoard(data.board);
      setCurrentPlayer(data.currentPlayer);
      setWinner(null);
      setDraw(false);
    } catch (error) {
      console.error("fetchBoard Error:", error);
      setBoard(Array(size * size).fill(null));
    }
  }

  async function handleSquareClick(index) {
    if (board[index] || winner || draw) return;

    let data = await makeMove(index, difficulty);
    setBoard(data.board);
    setWinner(data.winner);
    setDraw(data.draw);
    setCurrentPlayer(data.winner ? currentPlayer : currentPlayer === 'X' ? 'O' : 'X');

    if (!data.winner && !data.draw) {
      setTimeout(async () => {
        const cpuMove = await makeMove(-1, difficulty);
        setBoard(cpuMove.board);
        setWinner(cpuMove.winner);
        setDraw(cpuMove.draw);
        setCurrentPlayer(cpuMove.winner ? currentPlayer : currentPlayer === 'X' ? 'O' : 'X');
      }, 500);
    }
  }

  function handleDifficultyChange(value) {
    setDifficulty(parseFloat(value));
  }

  async function handleReset() {
    await resetGame();
    fetchBoard();
  }

  function handleReturnLobby() {
    router.push('/lobby');
  }

  return (
    <div className={styles.cpuGameContainer}>
      <div className={styles.logoShakersCPU}>
        <img 
          src="/letter.png" 
          alt="Game Logo" 
          className="game-logo"
          onClick={handleReturnLobby}
        />
      </div>

      <h1 className={styles.gameTitle}>Tic Tac Toe - CPU Mode</h1>

      <div className={styles.gameLayout}>
        <Group gap={220} mt={70}>
          <GameMenu
            mode="cpu"
            size={size}
            onSizeChange={() => {}} 
            winner={winner}
            draw={draw}
            currentPlayer={currentPlayer}
            onReset={handleReset}
            onReturnLobby={handleReturnLobby}
            onDifficultyChange={handleDifficultyChange}
            difficulty={difficulty}
          />

          <div className={styles.gameCenter}>
            <GameBoard board={board} onSquareClick={handleSquareClick} size={size} />
          </div>
        
          <div className={styles.imageCpu}>
            <img 
              src="/shakers-ai-cartel.png" 
              alt="Shakers AI Cartel" 
              className={styles.imageAI}
              onClick={() => window.open("https://www.shakersworks.com/shakers_ai_betatester", "_blank")}
            />
          </div>
        </Group>
      </div>
    </div>
  );
}