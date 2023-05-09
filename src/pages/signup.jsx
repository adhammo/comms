import Head from 'next/head'
// import styles from '@/styles/signup.module.css'

import Auth from '@/components/auth/auth'

export const Signup = () => (
  <>
    <Head>
      <title>Sign up | Comms</title>
      <meta name="description" content="Sign up to Comms" />
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
      <Auth authType={'Sign Up'} />
    </div>
  </>
)

export default Signup
