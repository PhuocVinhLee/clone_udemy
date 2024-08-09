// components/PermissionHandler.tsx
"use client";
import { useEffect, useState } from "react";

const PermissionHandler = () => {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          setPermissionGranted(permission === "granted");
        } else {
          setPermissionGranted(Notification.permission === "granted");
        }
      }
    };

    requestPermission();
  }, []);

  return null; // This component does not render anything
};

export default PermissionHandler;
