import Head from 'next/head'
// import styles from '@/styles/signup.module.css'

import Auth from '@/components/auth/auth'

export declare type SignupProps = {
  setStatus: (message: string, error: boolean) => void
}

export const Signup = ({ setStatus }: SignupProps) => (
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
        marginTop: '2rem'
      }}
    >
      <Auth authType={'Sign Up'} setStatus={setStatus} />
    </div>
  </>
)

export default Signup
