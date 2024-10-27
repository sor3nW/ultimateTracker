// app/dashboard/page.tsx

import { getPlayersOrderedByRank } from '@/lib/firebase/firebase';
import { Player } from '@/types/types';
import DashboardContent from '@/components/DashboardContent';

// Server Component
export default async function Dashboard() {
  const players: Player[] = await getPlayersOrderedByRank(); // Fetch data server-side
  return <DashboardContent players={players} />; // Pass data to client component
}
