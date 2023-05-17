import Head from 'next/head'
import styles from '@/styles/home.module.css'

import TipTap from '@/components/tiptap/tiptap'

export const Home = ({ title }: { title: string }) => (
  <>
    <Head>
      <title>EECE Blog Website | Comms</title>
      <meta name="description" content="EECE Website" />
    </Head>
    
  </>
)

export default Home
