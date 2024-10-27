"use client";
import React, { useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Player } from "@/types/types";

export default function PlayerForm() {
  // Omit 'id' along with 'rank' and 'score'
  const [formData, setFormData] = useState<Omit<Player, "id" | "rank" | "score">>({
    name: "",
    position: "",
    skills: {
      turns: 0,
      catches: 0,
      scores: 0,
      defenses: 0,
      totalthrows: 0,
      goodthrows: 0,
      teamWins: 0,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in formData.skills) {
      setFormData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          [name]: parseInt(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const playersCollection = collection(
        db,
        "organizations",
        "S0m6M4GFVpxmd2H3NwoE",
        "players"
      );

      // Fetch the highest current rank
      const rankQuery = query(
        playersCollection,
        orderBy("rank", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(rankQuery);
      let highestRank = 0;
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        highestRank = docData.rank || 0;
      }
      const newRank = highestRank + 1;

      // Create new player data without 'id'
      const newPlayerData: Omit<Player, "id"> = {
        ...formData,
        score: 1000,
        rank: newRank,
      };

      // Add the new player to Firestore
      await addDoc(playersCollection, newPlayerData);

      
      // Reset form data
      setFormData({
        name: "",
        position: "",
        skills: {
          turns: 0,
          catches: 0,
          scores: 0,
          defenses: 0,
          totalthrows: 0,
          goodthrows: 0,
          teamWins: 0,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error adding player:", error);
      alert("Error adding player");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl p-6 bg-white shadow-md rounded-md"
    >
      <h2 className="text-2xl font-bold mb-4">Add New Player</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add Player
      </button>
    </form>
  );
}
