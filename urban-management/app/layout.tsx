import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import "leaflet/dist/leaflet.css";
import { UserProvider } from "@/components/providers/UserProvider";
import { ToastProvider } from "@/components/ui/toast/ToastProvider";
import { RealtimeProvider } from "@/lib/realtime/RealtimeProvider";
import "mapbox-gl/dist/mapbox-gl.css";
import { NotificationListener } from "@/features/notification/NotificationListener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart City System",
  description: "Urban Reflection System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <UserProvider>
            <ToastProvider>
              <RealtimeProvider>
                <NotificationListener />
                {children}
              </RealtimeProvider>
            </ToastProvider>
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
