// src/lib/firebase.ts

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACIs3GWoNIII7ZJau_446FzeDLYy2r-cM",
  authDomain: "ultimate-tracker-7eabd.firebaseapp.com",
  projectId: "ultimate-tracker-7eabd",
  storageBucket: "ultimate-tracker-7eabd.appspot.com",
  messagingSenderId: "197753987476",
  appId: "1:197753987476:web:7ea7d5711b271c0fff2f81",
  measurementId: "G-X8GY80YM78"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

// src/lib/firebase.ts

import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Player } from '@/types/types'; // Import the Player type


export async function getPlayersOrderedByRank(): Promise<Player[]> {
    const playersCollection = collection(db, '/organizations/S0m6M4GFVpxmd2H3NwoE/players');
    const q = query(playersCollection, orderBy('rank', 'asc'));

    try {
        const querySnapshot = await getDocs(q);
        console.log("Fetched players from Firestore:", querySnapshot.size);

        const players: Player[] = querySnapshot.docs.map((doc) => {
            const data = doc.data() as Omit<Player, 'id'>;
            console.log("Player data:", data); // Log each player’s data

            return {
                id: doc.id,
                rank: data.rank,
                name: data.name,
                score: data.score,
                position: data.position,
                skills: data.skills,
            };
        });

        return players;
    } catch (error) {
        console.error("Error fetching players:", error);
        return [];
    }
}
export async function getPlayerStats(): Promise<Player[]> {
    const playersCollection = collection(db, '/organizations/S0m6M4GFVpxmd2H3NwoE/players');
    const q = query(playersCollection, orderBy('rank', 'asc'));

    try {
        const querySnapshot = await getDocs(q);
        console.log("Fetched players from Firestore:", querySnapshot.size);

        const players: Player[] = querySnapshot.docs.map((doc) => {
            const data = doc.data() as Omit<Player, 'id'>;
            console.log("Player data:", data); // Log each player’s data

            return {
                id: doc.id,
                rank: data.rank,
                name: data.name,
                score: data.score,
                position: data.position,
                skills: data.skills,
            };
        });

        return players;
    } catch (error) {
        console.error("Error fetching players:", error);
        return [];
    }
}


