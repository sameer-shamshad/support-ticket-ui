'use client';
import { useEffect, useSyncExternalStore } from "react";
import { toastStore } from "@/store/toastStore";

export const useToast = () => {
  const message = useSyncExternalStore(
    toastStore.subscribe.bind(toastStore),
    toastStore.getMessage.bind(toastStore)
  );

  const pushToast = (text: string) => {
    toastStore.setMessage(text);
  };

  const dismissToast = () => {
    toastStore.setMessage(null);
  };

  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => toastStore.setMessage(null), 3000);
    return () => clearTimeout(timeout);
  }, [message]);

  return { message, pushToast, dismissToast };
};
