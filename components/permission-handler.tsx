// components/PermissionHandler.tsx
"use client"
import { useEffect, useState } from 'react';

const PermissionHandler: React.FC = () => {
  const [permissionGranted, setPermissionGranted] = useState(Notification.permission === 'granted');

  useEffect(() => {
    const requestPermission = async () => {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        setPermissionGranted(permission === 'granted');
      }
    };

    requestPermission();
  }, []);

  return null; // This component does not render anything
};

export default PermissionHandler;
