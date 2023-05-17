import Head from 'next/head'
// import styles from '@/styles/signin.module.css'

import Auth from '@/components/auth/auth'

export declare type SigninProps = {
  setStatus: (message: string, error: boolean) => void
}

export const Signin = ({setStatus}: SigninProps) => (
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
      <Auth authType={'Sign In'} setStatus={setStatus} />
    </div>
  </>
)

export default Signin
