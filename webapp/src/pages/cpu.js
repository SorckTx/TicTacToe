import GameCpu from '../components/CPU/GameCpu';
import { getTokenServerSide } from '../lib/auth';

export default function CpuPage() {
  return <GameCpu />;
}

export async function getServerSideProps(context) {
  return getTokenServerSide(context);
}
