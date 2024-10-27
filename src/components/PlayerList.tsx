// src/app/components/PlayerList.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Player } from "@/types/types";

export default function PlayerList() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playersCollection = collection(
          db,
          "organizations",
          "S0m6M4GFVpxmd2H3NwoE",
          "players"
        );
        const playersQuery = query(playersCollection, orderBy("name"));
        const querySnapshot = await getDocs(playersQuery);
        const playersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Player, "id">),
        }));
        setPlayers(playersData);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  const handleDelete = async (playerId: string, playerName: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${playerName}?`
    );
    if (confirmDelete) {
      try {
        await deleteDoc(
          doc(
            db,
            "organizations",
            "S0m6M4GFVpxmd2H3NwoE",
            "players",
            playerId
          )
        );
        setPlayers((prevPlayers) =>
          prevPlayers.filter((player) => player.id !== playerId)
        );
        
        window.location.reload();
      } catch (error) {
        console.error("Error deleting player:", error);
        alert("Error deleting player");
      }
    }
  };

  return (
    <div className="max-w-2xl  p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Player List</h2>
      <ul>
        {players.map((player) => (
          <li
            key={player.id}
            className="flex justify-between items-center mb-2"
          >
            <span>{player.name}</span>
            <button
              onClick={() => handleDelete(player.id, player.name)}
              className="text-red-500 hover:text-red-700"
            >
              {/* Trash Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={` h-6 w-6`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                />
            </svg>

            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
