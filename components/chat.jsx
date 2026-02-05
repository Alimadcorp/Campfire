"use client";
import { useState } from 'react';
import { LucideCornerRightUp, LucideMessageCircleMore } from "lucide-react";

export default function Chat({ user }) {
  const [msg, setMsg] = useState("");

  function sendMessage() {
    console.log("Sending message:", msg);
  }

  return (
    <div className="w-full bg-white/5 p-4 rounded-3xl border border-white/10 hover:bg-white/10 hover:backdrop-blur-none backdrop-blur-sm transition-all duration-300 cursor-default group flex flex-col">
      <div>
        <h4 className="text-lg sm:text-xl font-subheading flex items-center gap-2 text-white/90">
          <LucideMessageCircleMore size={20} className="text-amber-400" />
          The Chat
        </h4>
        <p className="text-xs sm:text-sm opacity-50 mt-1">
        </p>
      </div>
      <div className="flex-1 flex flex-col w-full">
        <div className="flex-1 w-full overflow-y-auto mb-4 font-subheading p-1 space-y-2">
          <div className="whitespace-pre-wrap">{"Ali: hi sorry chats arent ready yet"}</div>
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
            placeholder="Type smth out..."
            aria-label="Message input"
            className="flex-1 font-subheading px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 text-md text-white/90"
          />
          <button
            type="button"
            onClick={sendMessage}
            className="px-3 py-2 rounded-lg bg-cyan-500/90 hover:bg-cyan-500 text-white text-md flex items-center gap-2"
            aria-label="Send"
          >
            <LucideCornerRightUp size={16} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}