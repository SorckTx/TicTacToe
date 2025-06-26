import Game from '../components/Local/Game';
import { getTokenServerSide } from '../lib/auth';

export default function LocalPage() {
  return <Game />;
}

export async function getServerSideProps(context) {
  return getTokenServerSide(context);
}
