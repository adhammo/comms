import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { Inter, Roboto } from 'next/font/google'
import { Session, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import Dashboard from '@/components/dashboard/dashboard'
import classNames from 'classnames'
import styles from '@/styles/author.module.css'

import getImageSrc from '@/lib/storage'
import { getProfileById } from '@/lib/profiles'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import Image from 'next/image'

const inter = Inter({
  subsets: ['latin'],
  weight: '700',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
})

declare type User = {
  username: string
  first_name: string
  last_name: string
  role: string
  bio: string
  picture: boolean
}

declare type AuthorProps = {
  initailSession: Session
  user: User
  setStatus: (message: string, error: boolean) => void
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    }

  return {
    props: {
      initialSession: session,
      user: await getProfileById(session.user.id),
    },
  }
}

export const Author = ({ user: { username, first_name, last_name, bio, role, picture }, setStatus }: AuthorProps) => {
  const router = useRouter()
  const supabase = useSupabaseClient()
  return (
    <>
      <Head>
        <title>Author | Comms</title>
        <meta name="description" content="Manage and author articles" />
      </Head>
      <div className={styles.author}>
        {picture ? (
          <img
            className={styles.image}
            src={getImageSrc(`/profiles/${username}.jpg`)}
            alt={`${first_name} Image`}
            width={200}
            height={200}
          />
        ) : (
          <Image className={styles.image} src={'/default.jpg'} alt={`${first_name} Image`} width={200} height={200} />
        )}
        <h1 className={classNames(styles.name, inter.className)}>{`${first_name} ${last_name}`}</h1>
        <div className={styles.signoutContainer}>
          <button
            className={styles.signout}
            type="button"
            title="Sign out of your account"
            onClick={() => {
              supabase.auth.signOut().then(({ error }) => {
                if (error) setStatus(error.message, true)
                else {
                  setStatus('Sign out succeeded', false)
                  router.push('/')
                }
              })
            }}
          >
            Sign out
          </button>
        </div>
      </div>
      <div className={styles.head}>
        <h1 className={classNames(styles.title, inter.className)}>Dashboard</h1>
        <p className={classNames(styles.description, roboto.className)}>What action you want to take?</p>
      </div>
      <Dashboard username={username} role={role} setStatus={setStatus} />
    </>
  )
}

export default Author
