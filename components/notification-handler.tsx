// components/NotificationHandler.tsx
"use client";
import { useState, useEffect } from "react";
import NotificationSound from "./notification-sound";
import { pusherClient } from "@/lib/pusher"; // Adjust this import based on your setup
import { useUser } from "@clerk/nextjs";
import { boolean } from "zod";

interface  NotificationHandlerProps{
    playSoundProp: string;
}
const NotificationHandler = ({playSoundProp}: NotificationHandlerProps) => {
  const [playSound, setPlaySound] = useState(false);

  useEffect(() => {
   if(playSoundProp){
    setPlaySound(true);
    // Reset playSound after a short delay
    setTimeout(() => setPlaySound(false), 3000);
   }
  }, [playSoundProp]);

  return (
    <div>
      <NotificationSound playSound={playSound} />
      {/* Render other parts of your notifications here */}
    </div>
  );
};

export default NotificationHandler;
