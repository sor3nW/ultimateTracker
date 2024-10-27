// src/app/create-club/page.tsx
import React from 'react';

const CreateClubPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-white">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-slate-500">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">Create or Join a Club</h1>
        
        {/* Create a Club Button */}
        <div className="mb-6">
          <button className="w-full px-4 py-2 text-lg font-semibold text-black bg-white rounded-lg hover:bg-gray-300 transition">
            Create a Club
          </button>
        </div>

        {/* Input Group Code */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Input Group Code"
            className="flex-1 px-4 py-2 text-black rounded-lg outline-none focus:ring-2 focus:ring-white"
          />
          <button className="px-4 py-2 font-semibold text-black bg-white rounded-lg hover:bg-gray-300 transition">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateClubPage;
