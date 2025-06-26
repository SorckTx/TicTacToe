import Image from 'next/image';
import Carousel from '../Carousel/Carousel'; 
import { useEffect, useState }  from 'react';
import { getUserFromToken } from '../../lib/auth';
import { logout } from '../../lib/api';
import { useRouter } from 'next/router';
import { Group, Button, Stack} from '@shakers/ui';
import { IconStarFilled,IconDeviceGamepad, IconUser, IconUsers } from '@tabler/icons-react';
import styles from './Lobby.module.css';

export default function Lobby({ onSelectMode }) {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') { 
      const user = getUserFromToken();
      setUsername(user);
    }
  }, []);

  function handleLogout() {
    logout();
    router.push('/login'); 
  }
  return (
    
    <div className={styles.lobbyContainer}>
        
        <div className={styles.logoShakers}>
          <Image src="/letter.png" alt="Logo" width={300} height={100} priority />
          <h1>Tic Tac Toe</h1>
        </div>

      <div className={styles.authContainer}>
        {username ? (
          <div className={styles.userMenu}>
            <Button color='yellow' size='lg' onClick={() => setDropdownOpen(!dropdownOpen)} variant="default">
              {username}
            </Button>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Button color="red" onClick={handleLogout} variant="default">
                  Logout
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.registerButtons}>
            <Group gap={17}>
              <Button color='yellow' size='lg' onClick={() => onSelectMode('register')}>Create Account</Button>
              <Button size='lg' onClick={() => onSelectMode('login')} variant='default'>Login</Button>
            </Group>
          </div>
        )}
      </div>

        <div className={styles.topContainer}>
          <Button leftIcon={<IconStarFilled/>} color='yellow' size='lg' onClick={() => onSelectMode('top')}>Top Players</Button>
        </div>

      <div className={styles.menuContainer}>
        <div className= {styles.modesButtons}>
          <Carousel />

          <Stack gap={15} w={400} h={350}>
            <h2 className= {styles.titleTic}>Play Tic Tac Toe on the best freeworking site!</h2>
            <Button leftIcon={<IconUser/>} onClick={() => onSelectMode('local')}  variant="default">Play Local</Button>
            <Button leftIcon={<IconDeviceGamepad/>} onClick={() => onSelectMode('cpu')}  variant="default">Play Computer</Button>
            <Button leftIcon={<IconUsers/>} onClick={() => onSelectMode('pvp')}  variant="default">Play Online</Button>
          </Stack>
        </div>
      </div>
    </div>
  );
}
