import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { Inter, Roboto } from 'next/font/google'
import { Session, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import Dashboard from '@/components/dashboard/dashboard'
import classNames from 'classnames'
import styles from '@/styles/author.module.css'

import getImageSrc from '@/lib/storage'
import { getProfileById } from '@/lib/profiles'

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
}

declare type AuthorProps = { initailSession: Session; user: User }

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

export const Author = ({ user: { username, first_name, last_name, bio, role } }: AuthorProps) => (
  <>
    <Head>
      <title>Author | Comms</title>
      <meta name="description" content="Manage and author articles" />
    </Head>
    <div className={styles.author}>
      <img className={styles.image} src={getImageSrc(`/profiles/${username}.jpg`)} alt={`${first_name} Image`} />
      <h1 className={classNames(styles.name, inter.className)}>{`${first_name} ${last_name}`}</h1>
      <p className={classNames(styles.bio, roboto.className)}>{bio}</p>
    </div>
    <div className={styles.head}>
      <h1 className={classNames(styles.title, inter.className)}>Dashboard</h1>
      <p className={classNames(styles.description, roboto.className)}>What action you want to take?</p>
    </div>
    <Dashboard username={username} role={role} />
  </>
)

export default Author
