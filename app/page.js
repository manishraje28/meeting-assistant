"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleJoin=()=>{
    const name = username.trim() === ""? "Anonymous" : username.trim();

    const meetingId = process.env.NEXT_PUBLIC_CALL_ID;
    
    router.push(`/meeting/${meetingId}?name=${encodeURIComponent(name)}`);

  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="p-8 bg-gray-800/60 rounded-2x1 border border-gray-700 w-80 shadow-2x1">
        <h2 className="text-xl font-semibold mb-4 text-center">Enter your name</h2>


        <input placeholder="Your name" className="px-4 w-full py-3 2-full rounded-lg bg-gray-700/80 border border-gray-600 text-white" 
        value={username}  
        onChange={(e) => setUsername(e.target.value)}
        ></input>

        <button className="mt-5 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
        onClick={handleJoin}
        > Join meeting</button>
      </div>
    </div>
  );
}
