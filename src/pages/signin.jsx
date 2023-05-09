import Head from 'next/head'
// import styles from '@/styles/signin.module.css'

import Auth from '@/components/auth/auth'

export const Signin = () => (
  <>
    <Head>
      <title>Sign in | Comms</title>
      <meta name="description" content="Sign in to your Comms account" />
    </Head>
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Auth authType={'Sign In'} />
    </div>
  </>
)

export default Signin
