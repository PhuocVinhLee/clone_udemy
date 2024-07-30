"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationTarget {
    rootId: string | null;
    targetId: string | null;
}

interface NotificationContextProps {
    target: NotificationTarget;
    setTarget: (target: NotificationTarget) => void;
    targetType: string | null;
    setTargetType: (type: string | null) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [target, setTarget] = useState<NotificationTarget>({ rootId: null, targetId: null });
    const [targetType, setTargetType] = useState<string | null>(null);

    return (
        <NotificationContext.Provider value={{ target, setTarget, targetType, setTargetType }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
