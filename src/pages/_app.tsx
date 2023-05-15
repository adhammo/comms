import { useState } from 'react'
import type { AppProps } from 'next/app'
import { Session, createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import Layout from '@/components/layout/layout'
import '@/styles/globals.css'

const App = ({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  return (
    <>
      <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionContextProvider>
    </>
  )
}

export default App
