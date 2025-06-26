import GamePvp from '../components/PVP/GamePvp';
import { getTokenServerSide } from '../lib/auth';

export default function PVPPage() {
  return <GamePvp />;
}

export async function getServerSideProps(context) {
  return getTokenServerSide(context);
}
