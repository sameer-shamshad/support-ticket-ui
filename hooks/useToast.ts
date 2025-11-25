'use client';
import { useCallback, useEffect, useState } from "react";

export const useToast = () => {
    const [message, setMessage] = useState<string | null>(null);

    const pushToast = useCallback((text: string) => {
        setMessage(text);
    }, []);

    const dismissToast = useCallback(() => {
        setMessage(null);
    }, []);

    useEffect(() => {
        if (!message) return;
        const timeout = setTimeout(() => setMessage(null), 3000);
        return () => clearTimeout(timeout);
    }, [message]);

    return { message, pushToast, dismissToast };
};

