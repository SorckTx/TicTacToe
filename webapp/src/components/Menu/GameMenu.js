import { logout } from '../../lib/api';
import styles from './Menu.module.css';
import { Button, Stack, Select, Text } from '@shakers/ui';

export default function GameMenu({ mode, size, onSizeChange, winner, draw, currentPlayer, onReset, onReturnLobby, onDifficultyChange, difficulty }) {
  return (
    <div className={styles.gameButtons}>
      {mode === 'local' && (
        <Select 
          label={<Text c="white" size='lg' fw="bold">Board Size</Text>}
          placeholder="Select a size"
          data={[
            { label: "3x3", value: "3" },
            { label: "4x4", value: "4" },
            { label: "5x5", value: "5" },
            { label: "9x9", value: "9" }
          ]}
          value={size}
          onChange={(value) => onSizeChange(value)}
          searchable={false}
        />
      )}

      {mode === 'cpu' && (
        <Select 
          label= {<Text c="white" size='lg' fw="bold">Difficulty</Text>}
          placeholder="Select a difficulty"
          data={[
            { label: "Noob", value: "0.1" },
            { label: "Easy", value: "0.25" },
            { label: "Normal", value: "0.83" },
            { label: "Impossible", value: "0.95" }
          ]}
          value={difficulty}
          onChange={(value) => onDifficultyChange(value)}
          searchable={false}
        />
      )}

      {winner ? (
        <p className={styles.gameResult}>Winner: {winner}</p>
      ) : draw ? (
        <p className={styles.gameResult}>Draw</p>
      ) : (
        <p className={styles.gameTurn}>Turn: {currentPlayer}</p>
      )}

      <Stack>
        <Button onClick={onReset}>Restart Game</Button>
        <Button onClick={onReturnLobby}>Back to Lobby</Button>
        <Button onClick={logout}>Log Out</Button>
      </Stack>
    </div>
  );
}