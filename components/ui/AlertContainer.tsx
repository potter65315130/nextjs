'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert, AlertProps } from './alerts';

type AlertType = Omit<AlertProps, 'onClose'> & { id: number };

interface AlertContextType {
    showAlert: (alert: Omit<AlertProps, 'onClose'>) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertContainerProvider = ({ children }: { children: React.ReactNode }) => {
    const [alerts, setAlerts] = useState<AlertType[]>([]);

    const showAlert = useCallback((alert: Omit<AlertProps, 'onClose'>) => {
        const id = Date.now();
        const newAlert = { ...alert, id };

        setAlerts((prev) => [...prev, newAlert]);

        // ตั้งเวลาให้หายไปเอง 5 วินาที
        setTimeout(() => {
            setAlerts((prev) => prev.filter((a) => a.id !== id));
        }, 5000);
    }, []);

    const closeAlert = (id: number) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}

            {/* ส่วนแสดงผล Alert แบบ Fixed ที่มุมขวาบน */}
            <div className="fixed top-5 left-1/2 -translate-x-1/2 z-9999 w-full max-w-sm space-y-3 pointer-events-none px-4 md:px-0">
                {alerts.map((alert) => (
                    <div key={alert.id} className="pointer-events-auto animate-in slide-in-from-right-full fade-in duration-300">
                        <Alert
                            type={alert.type}
                            title={alert.title}
                            message={alert.message}
                            onClose={() => closeAlert(alert.id)}
                        />
                    </div>
                ))}
            </div>
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertContainerProvider');
    }
    return context;
};