import "@/styles/globals.css";
import type { AppProps } from 'next/app'
import { Inter } from "next/font/google";
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });


export default function MyApp({ Component, pageProps }: AppProps<{
  initialSession: Session
}>) {
    const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <style jsx global>{`
          html {
            font-family: ${inter.style.fontFamily};
          }
        `}</style>
      <Component {...pageProps} />
      <Toaster/>
    </SessionContextProvider>
  )
}