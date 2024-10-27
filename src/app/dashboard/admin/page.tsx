// app/dashboard/page.tsx

import PlayerList from '@/components/PlayerList';
import { SignedIn, UserButton } from '@clerk/nextjs';
import PlayerForm from '@/components/PlayerForm';
export default async function Admin() {

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
            <div className='justify-end'>
            <PlayerForm />
            <PlayerList />
            </div>
        </div>
    );
}
