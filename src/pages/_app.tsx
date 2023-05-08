import type { AppProps } from 'next/app'
import '@/styles/globals.css'

import Layout from '@/components/layout/layout'

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </>
)

export default App
