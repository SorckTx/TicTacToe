import Lobby from '../components/Lobby/Lobby';
import { useRouter } from 'next/router';

export default function LobbyPage() {
  const router = useRouter();

  const handleModeSelection = (mode) => {
    router.push(`/${mode}`);
  };

  return <Lobby onSelectMode={handleModeSelection} />;
}