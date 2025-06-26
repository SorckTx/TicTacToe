import styles from './board.module.css'; 

export default function GameBoard({ board, onSquareClick, size }) {
  if (!board || board.length === 0) {
    return <p>Cargando tablero...</p>; 
  }

  return (
    <div
      className={styles.board}
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        display: 'grid',
        gap: '8px',
      }}
    >
      {board.map((cell, idx) => (
        <div key={idx} data-cy={`square_${idx}`} className={styles.square} onClick={() => onSquareClick(idx)}>
          {cell}
        </div>
      ))}
    </div>
  );
}