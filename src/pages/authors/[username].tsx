import React from 'react'
import Head from 'next/head'
import { Inter, Roboto } from 'next/font/google'
import PostCard from '@/components/post/post'
import styles from '@/styles/authors.module.css'
import classNames from 'classnames'
import { getAllLiveProfiles, getProfile } from '@/lib/profiles'
import getImageSrc from '@/lib/storage'
import { getUserPosts } from '@/lib/posts'

const inter = Inter({
  subsets: ['latin'],
  weight: '700',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
})

export declare type AuthorPath = { params: { username: string } }

export declare type AuthorProps = {
  profile: {
    username: string
    first_name: string
    last_name: string
    role: string
    bio: string
  }
  posts: {
    id: string
    profiles: { username: string; first_name: string; last_name: string }
    category: string
    created_at: string
    title: string
    description: string
    read_time: number
  }[]
}

export async function getStaticPaths(): Promise<{ paths: AuthorPath[]; fallback: boolean }> {
  const profiles = await getAllLiveProfiles()
  return {
    paths: profiles.map(profile => ({ params: { username: profile.username } })),
    fallback: false,
  }
}

export async function getStaticProps({ params: { username } }: AuthorPath): Promise<{ props: AuthorProps }> {
  const profile = await getProfile(username)
  const posts = await getUserPosts(profile.username)
  return {
    props: { profile, posts } as AuthorProps,
  }
}

export default function Author({ profile, posts }: AuthorProps) {
  return (
    <>
      <Head>
        <title>{`${profile.first_name} ${profile.last_name} | Comms`}</title>
        <meta name="description" content={`${profile.first_name} ${profile.last_name} Author Info`} />
      </Head>
      <div className={styles.author}>
        <img
          className={styles.image}
          src={getImageSrc(`/profiles/${profile.username}.jpg`)}
          alt={`${profile.first_name} Image`}
          width={200}
          height={200}
        />
        <h1 className={classNames(styles.name, inter.className)}>{`${profile.first_name} ${profile.last_name}`}</h1>
        <p className={classNames(styles.bio, roboto.className)}>{profile.bio}</p>
      </div>
      <div className={styles.head}>
        <h1 className={classNames(styles.title, inter.className)}>Posts</h1>
      </div>
      <div className={styles.posts}>
        {posts.length > 0
          ? posts.map(post => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                description={post.description}
                createdAt={post.created_at}
                category={post.category}
                profiles={post.profiles}
                readTime={post.read_time}
              />
            ))
          : '-- No articles found for this user --'}
      </div>
    </>
  )
}
