// components/NotificationSound.tsx
import { useEffect, useRef } from 'react';

interface NotificationSoundProps {
  playSound: boolean;
}

const NotificationSound: React.FC<NotificationSoundProps> = ({ playSound }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (playSound && Notification.permission === 'granted') {
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error('Audio playback failed:', error);
        });
      } else {
        // Handle case where audioRef is not set correctly
        console.error('AudioRef is not set');
      }
    }
  }, [playSound]);

  useEffect(() => {
    // Create an audio element and assign it to the ref
    audioRef.current = new Audio('/sound/pikachu-message-tone.mp3');
  }, []);

  return null; // This component does not render anything
};

export default NotificationSound;
