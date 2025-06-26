import { useEffect, useState } from 'react';
import { Table, Text } from '@shakers/ui';
import styles from './Top.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/leaderboard")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleReturnLobby() {
    router.push('/lobby');
  }

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.topContainer}>
      <div className={styles.logoShakers}>
        <Image src="/letter.png" alt="Logo" width={300} height={100} onClick={handleReturnLobby} priority />
        <h1 className={styles.titleTop}>Leaderboard</h1>
      </div>
      
      <div className={styles.tableContainer}>
        <Table
          borderColor="transparent"
          horizontalSpacing="md"
          verticalSpacing="md"
          withColumnBorders={false}
          withRowBorders={false}
          withTableBorder={false}
          className={styles.customTable}
        >
              <Table.Thead>
                  <Table.Tr>
                  <Table.Th className={styles.rankCell}>Rank</Table.Th>
                  <Table.Th className={styles.nameCell}>Username</Table.Th>
                  <Table.Th className={styles.scoreCell}>Wins</Table.Th>
                  </Table.Tr>
              </Table.Thead>
        
          <Table.Tbody mb = {20} >
            {data.map((player, index) => (
              <Table.Tr 
                key={index} 
                className={`${styles.playerRow} ${index === 0 ? styles.firstPlace : ''}`}
              >
                <Table.Td className={styles.rankCell}>{index + 1}</Table.Td>
                <Table.Td className={styles.nameCell}>{player.username}</Table.Td>
                <Table.Td className={styles.scoreCell}><Text ta="right">{player.wins}</Text></Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
}