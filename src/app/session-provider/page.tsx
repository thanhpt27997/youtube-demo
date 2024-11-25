// app/ClientSessionProvider.tsx

'use client'; // Đảm bảo đây là Client Component

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function ClientSessionProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>{children}</SessionProvider>
  )
}
