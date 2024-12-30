"use client"
import "./globals.css";
import { SessionProvider } from "next-auth/react";
export default function WrapperProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <SessionProvider>
        {children}{}
      </SessionProvider>
  );
}