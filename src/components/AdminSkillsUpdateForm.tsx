// components/AdminSkillsUpdateForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

interface Player {
  id: string;
  name: string;
  skills: Record<string, number>;
}

interface SkillOption {
  label: string;
  value: string;
}

const AdminSkillsUpdateForm: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [skillValue, setSkillValue] = useState<number>(0);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Fetch players from the specified team
        const playersCollectionRef = collection(
          db,
          "organizations",
          "S0m6M4GFVpxmd2H3NwoE", // Use the actual ID of the UTSA team
          "players"
        );
        const playersSnapshot = await getDocs(playersCollectionRef);
        const playersList = playersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Player, "id">),
        }));
        setPlayers(playersList);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    // Set the skills options based on the selected player
    if (selectedPlayerId) {
      const selectedPlayer = players.find(
        (player) => player.id === selectedPlayerId
      );
      if (selectedPlayer && selectedPlayer.skills) {
        const skillOptions = Object.keys(selectedPlayer.skills).map((skill) => ({
          label: skill,
          value: skill,
        }));
        setSkills(skillOptions);
      } else {
        setSkills([]);
      }
    } else {
      setSkills([]);
    }
    setSelectedSkill("");
    setSkillValue(0);
  }, [selectedPlayerId, players]);

  const handlePlayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlayerId(e.target.value);
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSkill(e.target.value);
    const selectedPlayer = players.find(
      (player) => player.id === selectedPlayerId
    );
    if (selectedPlayer && selectedPlayer.skills && e.target.value) {
      setSkillValue(selectedPlayer.skills[e.target.value] || 0);
    } else {
      setSkillValue(0);
    }
  };

  const handleIncrement = () => {
    setSkillValue((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setSkillValue((prev) => prev - 1);
  };

  const handleSkillValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillValue(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId || !selectedSkill) {
      alert("Please select a player and a skill.");
      return;
    }

    try {
      const playerDocRef = doc(
        db,
        "organizations",
        "S0m6M4GFVpxmd2H3NwoE",
        "players",
        selectedPlayerId
      );

      await updateDoc(playerDocRef, {
        [`skills.${selectedSkill}`]: skillValue,
      });

      alert("Skill updated successfully!");
    } catch (error) {
      console.error("Error updating skill:", error);
      alert("Failed to update skill. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md  p-6 bg-white shadow-md rounded-md"
    >
      <h2 className="text-2xl font-bold mb-4">Update Player Skill</h2>

      {/* Player Selection */}
      <div className="mb-4">
        <label className="block text-gray-700">Select Player</label>
        <select
          value={selectedPlayerId}
          onChange={handlePlayerChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="" disabled>
            -- Select a Player --
          </option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>

      {/* Skill Selection */}
      {selectedPlayerId && (
        <div className="mb-4">
          <label className="block text-gray-700">Select Skill</label>
          <select
            value={selectedSkill}
            onChange={handleSkillChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="" disabled>
              -- Select a Skill --
            </option>
            {skills.map((skill) => (
              <option key={skill.value} value={skill.value}>
                {skill.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Skill Value Adjustment */}
      {selectedSkill && (
        <div className="mb-4">
          <label className="block text-gray-700">Adjust Skill Value</label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleDecrement}
              className="px-4 py-2 bg-red-500 text-white rounded-l"
            >
              -
            </button>
            <input
              type="number"
              value={skillValue}
              onChange={handleSkillValueChange}
              className="w-full p-2 border-t border-b border-gray-300 text-center"
            />
            <button
              type="button"
              onClick={handleIncrement}
              className="px-4 py-2 bg-green-500 text-white rounded-r"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Update Skill
      </button>
    </form>
  );
};

export default AdminSkillsUpdateForm;
