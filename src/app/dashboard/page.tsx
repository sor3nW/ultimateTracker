// app/dashboard/page.tsx

import { getPlayersOrderedByRank } from '@/lib/firebase/firebase';
import { Player } from '@/types/types';
import { SignedIn, UserButton } from '@clerk/nextjs';

export default async function Dashboard() {
    const players: Player[] = await getPlayersOrderedByRank();

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="flex flex-row justify-between items-center pb-8">
                <h1 className="text-4xl font-bold text-black">Team Dashboard</h1>
                <div className="flex flex-row">
                    <SignedIn>
                        <h1 className="pr-2">My Account</h1>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
            <div>
                <h1>Player Rankings</h1>
                <div className="flex justify-center overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle ">
                    <div className="overflow-hidden shadow-md ">
                    <table className="min-w-full divide-y divide-gray-300 border-2 border-black rounded-lg">
                        <thead className="bg-gray-300">
                        <tr>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider"
                            >
                            Rank
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider"
                            >
                            Name
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider"
                            >
                            Score
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider"
                            >
                            Position
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">
                        {players.map((player) => (
                            <tr key={player.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {player.rank}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {player.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {player.score}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {player.position}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>

            </div>
        </div>
    );
}
