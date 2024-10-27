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
  getDoc,
  updateDoc,
  arrayUnion,
  setDoc,
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

const DashboardContent: React.FC<DashboardContentProps> = ({ players }) => {
  const { user } = useUser();
  const [newTeamName, setNewTeamName] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);
  const [invitationCode, setInvitationCode] = useState("");
  const [skillKeys, setSkillKeys] = useState<string[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        if (!user) {
          // User not logged in
          return;
        }

        // Fetch the user's document from 'users' collection
        const userDocRef = doc(db, "users", user.id);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const teamIds = userData.teamIds as string[];

          if (teamIds && teamIds.length > 0) {
            // Fetch teams that the user has access to
            const teamPromises = teamIds.map(async (teamId) => {
              const teamDocRef = doc(db, "organizations", teamId);
              const teamDocSnap = await getDoc(teamDocRef);
              if (teamDocSnap.exists()) {
                return {
                  id: teamDocRef.id,
                  ...(teamDocSnap.data() as Omit<Team, "id">),
                };
              } else {
                return null; // Team document does not exist
              }
            });

            const teamList = await Promise.all(teamPromises);
            // Filter out any null values
            const validTeams = teamList.filter(
              (team): team is Team => team !== null
            );
            setTeams(validTeams);
          } else {
            setTeams([]); // User has no teams
          }
        } else {
          // User document does not exist, create it
          await setDoc(userDocRef, {
            name: user.firstName || "",
            teamIds: [],
          });
          setTeams([]);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [user]);

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

          // Extract skill keys from the first player (assuming all players have the same skills)
          if (playerList.length > 0) {
            const firstPlayerSkills = playerList[0].skills || {};
            setSkillKeys(Object.keys(firstPlayerSkills));
          } else {
            setSkillKeys([]);
          }
        } catch (error) {
          console.error("Error fetching team players:", error);
        }
      };
      fetchTeamPlayers();
    } else {
      setTeamPlayers([]);
      setSkillKeys([]);
    }
  }, [selectedTeam]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      alert("Please enter a valid team name.");
      return;
    }

    if (!user) {
      alert("User not authenticated.");
      return;
    }

    try {
      const organizationRef = collection(db, "organizations");
      const docRef = await addDoc(organizationRef, {
        name: newTeamName,
        createdBy: user.id,
        createdAt: new Date(),
      });

      const newTeam: Team = {
        id: docRef.id,
        name: newTeamName,
        createdBy: user.id,
        createdAt: new Date(),
      };

      // Update the user's document to include the new team ID
      const userDocRef = doc(db, "users", user.id);
      await updateDoc(userDocRef, {
        teamIds: arrayUnion(docRef.id),
      });

      alert("Team created successfully!");
      setTeams((prevTeams) => [...prevTeams, newTeam]);
      setNewTeamName(""); // Reset the input field
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team. Please try again.");
    }
  };

  const handleJoinTeam = async () => {
    if (!invitationCode.trim()) {
      alert("Please enter a valid invitation code.");
      return;
    }

    if (!user) {
      alert("User not authenticated.");
      return;
    }

    try {
      // Check if the organization exists
      const teamDocRef = doc(db, "organizations", invitationCode.trim());
      const teamDocSnap = await getDoc(teamDocRef);
      if (teamDocSnap.exists()) {
        // Add the team ID to the user's teamIds array in the users collection
        const userDocRef = doc(db, "users", user.id);
        await updateDoc(userDocRef, {
          teamIds: arrayUnion(invitationCode.trim()),
        });

        // Fetch the team data and add it to the teams state
        const teamData = teamDocSnap.data() as Omit<Team, "id">;
        const newTeam: Team = {
          id: teamDocRef.id,
          ...teamData,
        };
        setTeams((prevTeams) => [...prevTeams, newTeam]);
        setInvitationCode(""); // Clear the input field
        alert("Successfully joined the team!");
      } else {
        alert("Team not found. Please check the invitation code.");
      }
    } catch (error) {
      console.error("Error joining team:", error);
      alert("Failed to join team. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <div className="bg-white flex flex-row justify-between items-center p-8 h-20 shadow-md border-b border-2 border-black">
        <h1 className="text-4xl font-bold text-black">
          {user?.firstName ? `${user.firstName}'s Dashboard` : "My Dashboard"}
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
              <a href="/create-team">
                <button className="px-2 py-2 w-64 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600">
                  Create Team
                </button>
              </a>
            </div>

            {/* Group Code Input and Submit Button */}
            <div className="flex flex-col items-center space-y-2 p-4">
              <input
                type="text"
                placeholder="Group Invitation Code"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                className="w-full px-2 py-2 text-black rounded-lg outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button
                onClick={handleJoinTeam}
                className="w-full px-2 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600"
              >
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
                <p className="text-lg text-slate-500">
                  {selectedTeam
                    ? `${selectedTeam.name} Team Details (Invitation Code: ${selectedTeam.id})`
                    : "Select a Team"}
                </p>
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
                          {/* Dynamically render skill headers */}
                          {skillKeys.map((skill) => (
                            <th
                              key={skill}
                              className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider"
                            >
                              {skill}
                            </th>
                          ))}
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
                  <h1 className="text-2xl font-bold mb-4 mt-2">
                    My Player Stats
                  </h1>
                  <h2 className="text-lg">Keep playing and your stats will appear soon!</h2>
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
};

export default DashboardContent;
