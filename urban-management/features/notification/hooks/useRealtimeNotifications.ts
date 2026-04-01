"use client";

import { useEffect } from "react";
import { useRealtimeClient } from "@/lib/realtime/RealtimeProvider";

export const useRealtimeNotifications = (onMessage: (payload: any) => void) => {
    const client = useRealtimeClient();

    useEffect(() => {
        if (!client) return;

        let subscription: any;

        const connectAndSubscribe = () => {
            if (client.connected) {
                subscription = client.subscribe(process.env.NEXT_PUBLIC_WS_NOTIFICATION_DEST!, (msg) => {
                    const payload = JSON.parse(msg.body);
                    console.log("🔥 Realtime notification:", payload);
                    onMessage(payload);
                });
            }
        };

        if (!client.connected) {
            client.onConnect = () => {
                console.log("✅ STOMP onConnect fired");
                connectAndSubscribe();
            };
        } else {
            connectAndSubscribe();
        }

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [client, onMessage]);
};