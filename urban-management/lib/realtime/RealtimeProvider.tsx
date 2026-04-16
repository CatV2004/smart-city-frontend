"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

interface RealtimeContextValue {
  client: Client | null;
}

const RealtimeContext = createContext<RealtimeContextValue>({ client: null });

export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: process.env.NEXT_PUBLIC_WS_URL,

      reconnectDelay: Number(
        process.env.NEXT_PUBLIC_WS_RECONNECT_DELAY || 5000
      ),

      debug:
        process.env.NEXT_PUBLIC_WS_DEBUG === "true"
          ? (msg) => console.log("[STOMP]", msg)
          : () => {},

      onConnect: () => {
        console.log("✅ Connected WebSocket (cookie auth)");
      },

      onStompError: (frame) => {
        console.error("❌ Broker error:", frame.headers["message"]);
      },

      onWebSocketError: (err) => {
        console.error("❌ WS error:", err);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{ client }}>
      {children}
    </RealtimeContext.Provider>
  );
};
export const useRealtimeClient = () => useContext(RealtimeContext).client;