// app/create-team/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useUser } from "@clerk/nextjs";

interface Statistic {
  name: string;
  initialValue: string;
}

const CreateTeamPage: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [score, setScore] = useState<number>(0);
  const [position, setPosition] = useState("");
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [statInput, setStatInput] = useState("");
  const [statValueInput, setStatValueInput] = useState("");

  const handleAddStatistic = () => {
    if (statInput.trim()) {
      setStatistics((prevStats) => [
        ...prevStats,
        { name: statInput.trim(), initialValue: statValueInput.trim() },
      ]);
      setStatInput("");
      setStatValueInput("");
    }
  };

  const handleRemoveStatistic = (index: number) => {
    setStatistics((prevStats) => prevStats.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      alert("Please enter a valid team name.");
      return;
    }

    if (!user) {
      alert("User not authenticated.");
      return;
    }

    try {
      // Create new organization (team)
      const organizationsRef = collection(db, "organizations");
      const newTeamRef = await addDoc(organizationsRef, {
        name: teamName.trim(),
        createdBy: user.id,
        createdAt: new Date(),
      });

      // Initialize statistics for the player (creator)
      const initialStats = statistics.reduce((statsObj, stat) => {
        let value: any;

        // Try to parse the initial value as a number
        if (!isNaN(Number(stat.initialValue))) {
          value = Number(stat.initialValue);
        } else if (
          stat.initialValue.toLowerCase() === "true" ||
          stat.initialValue.toLowerCase() === "false"
        ) {
          // Parse as boolean
          value = stat.initialValue.toLowerCase() === "true";
        } else {
          // Keep as string
          value = stat.initialValue;
        }

        statsObj[stat.name] = value;
        return statsObj;
      }, {} as Record<string, any>);

      // Add the player (team creator) to the team's players collection
      const playersRef = collection(db, "organizations", newTeamRef.id, "players");
      await addDoc(playersRef, {
        name: user.firstName || "Unnamed Player",
        userId: user.id,
        createdAt: new Date(),
        rank: 1, // Initialize rank to 1
        score: score, // Use provided score
        position: position, // Use provided position
        ...initialStats,
      });

      // Optionally, add the team ID to the user's document (if you have one)
      const userDocRef = doc(db, "users", user.id);
      await setDoc(
        userDocRef,
        { teamIds: [newTeamRef.id] },
        { merge: true }
      );

      // Redirect to /dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team. Please try again.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center ">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md w-full">
        <h1 className="text-2xl font-bold mb-4">Create a New Team</h1>
        <form onSubmit={handleSubmit}>
          {/* Team Name Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Score Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Initial Player Score</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Position Input */}
          <div className="mb-4">
            <label className="block text-gray-700">Your Position</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Statistics Inputs */}
          <div className="mb-4">
            <label className="block text-gray-700">Player Statistics</label>
            <div className="flex mb-2">
              <input
                type="text"
                value={statInput}
                onChange={(e) => setStatInput(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-l"
                placeholder="Statistic Name (e.g., goals)"
              />
              <input
                type="text"
                value={statValueInput}
                onChange={(e) => setStatValueInput(e.target.value)}
                className="w-32 p-2 border-t border-b border-gray-300"
                placeholder="Initial Value"
              />
              <button
                type="button"
                onClick={handleAddStatistic}
                className="p-2 bg-blue-500 text-white rounded-r"
              >
                Add
              </button>
            </div>
            {/* Display Added Statistics */}
            {statistics.length > 0 && (
              <ul className="mt-2">
                {statistics.map((stat, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-2 mt-1 rounded"
                  >
                    <span>
                      {stat.name}: {stat.initialValue}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStatistic(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Create Team
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamPage;
