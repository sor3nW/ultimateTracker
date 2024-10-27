// components/DashboardContent.tsx
"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Player } from "@/types/types";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";

interface DashboardContentProps {
    players: Player[];
  }

interface Team {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ players }) =>{
  const { user } = useUser();
  const [newTeamName, setNewTeamName] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamCollectionRef = collection(db, "organizations");
        const teamSnapshot = await getDocs(teamCollectionRef);
        const teamList = teamSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Team, "id">),
        }));
        setTeams(teamList);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      const fetchTeamPlayers = async () => {
        try {
          const playersCollectionRef = collection(
            db,
            "organizations",
            selectedTeam.id,
            "players"
          );

          // Order the players by 'rank' in ascending order
          const playersQuery = query(
            playersCollectionRef,
            orderBy("rank", "asc")
          );
          const playerSnapshot = await getDocs(playersQuery);
          const playerList = playerSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Player, "id">),
          }));
          setTeamPlayers(playerList);
        } catch (error) {
          console.error("Error fetching team players:", error);
        }
      };
      fetchTeamPlayers();
    } else {
      setTeamPlayers([]);
    }
  }, [selectedTeam]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      alert("Please enter a valid team name.");
      return;
    }

    try {
      const organizationRef = collection(db, "organizations");
      const docRef = await addDoc(organizationRef, {
        name: newTeamName,
        createdBy: user?.id || "",
        createdAt: new Date(),
      });

      const newTeam: Team = {
        id: docRef.id,
        name: newTeamName,
        createdBy: user?.id || "",
        createdAt: new Date(),
      };

      alert("Team created successfully!");
      setTeams((prevTeams) => [...prevTeams, newTeam]);
      setNewTeamName(""); // Reset the input field
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <div className="bg-white flex flex-row justify-between items-center p-8 h-20 shadow-md border-b border-2 border-black">
        <h1 className="text-4xl font-bold text-black">
          {user?.firstName}'s Dashboard
        </h1>
        <div className="flex flex-row">
          <SignedIn>
            <h1 className="pr-2">My Account</h1>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow grid grid-cols-5">
        {/* Sidebar */}
        <div className="col-span-1 border-2 border-black flex flex-col">
          <div className="w-full h-full bg-slate-500 p-4">
            <h2 className="text-white font-bold text-lg">My Teams</h2>
            <ul className="mt-4 space-y-2">
              {teams.map((team) => (
                <li
                  key={team.id}
                  className={`text-white text-sm bg-gray-700 p-2 rounded-lg cursor-pointer ${
                    selectedTeam?.id === team.id ? "bg-gray-600" : ""
                  }`}
                  onClick={() => setSelectedTeam(team)}
                >
                  {team.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full bg-black text-white flex flex-col items-center justify-center p-4">
            {/* Add Team Button */}
            <div className="flex flex-row items-center space-x-4 p-2">
              <input
                type="text"
                placeholder="New Team Name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="px-2 py-2 text-black rounded-lg outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button
                onClick={handleCreateTeam}
                className="px-2 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600"
              >
                Create Team
              </button>
            </div>

            {/* Group Code Input and Submit Button */}
            <div className="flex flex-row items-center space-x-2 p-4">
              <input
                type="text"
                placeholder="Group Invitation Code"
                className="px-2 py-2 text-black rounded-lg outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button className="px-2 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600">
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Player Rankings Table */}
        <div className="col-span-4 border-2 border-black p-8 overflow-y-auto">
          {selectedTeam ? (
            <>
              <h1 className="text-2xl font-bold mb-4">
                {selectedTeam.name} - Player Rankings
              </h1>
              <div className="flex justify-center overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle">
                  <div className="overflow-auto shadow-md">
                    <table className="min-w-full divide-y divide-gray-300 border-2 border-black rounded-lg">
                      <thead className="bg-gray-300">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                            Rank
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                            Position
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-300">
                        {teamPlayers.map((player) => (
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
            </>
          ) : (
            <h1 className="text-2xl font-bold">
              Please select a team to view player rankings.
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
