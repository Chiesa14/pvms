// src/app/layout.tsx
import "@/app/styles/globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PVMS",
  description: "Vehicle Parking Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="bottom-right" richColors />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
