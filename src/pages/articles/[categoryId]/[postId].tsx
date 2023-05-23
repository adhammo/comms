import React from 'react'
import Head from 'next/head'
import { Inter, Roboto } from 'next/font/google'
import { JSONContent } from '@tiptap/react'
import Viewer from '@/components/tiptap/viewer'
import styles from '@/styles/post.module.css'

import classNames from 'classnames'
import { getAllLivePosts, getPost } from '@/lib/posts'
import { Json } from '@/lib/database'
import { getDateString } from '@/utility/dates'
import getImageSrc from '@/lib/storage'
import Link from 'next/link'
import Image from 'next/image'

const inter = Inter({
  subsets: ['latin'],
  weight: '700',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
})

export declare type PostPath = { params: { categoryId: string; postId: string } }

export declare type PostProps = {
  post: {
    id: string
    profiles: { username: string; first_name: string; last_name: string; picture: boolean }
    category: string
    created_at: string
    title: string
    description: string
    content: Json
    read_time: number
  }
}

export async function getStaticPaths(): Promise<{ paths: PostPath[]; fallback: string }> {
  const posts = await getAllLivePosts()
  return {
    paths: posts.map(post => ({ params: { categoryId: post.category, postId: post.id } })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({
  params: { postId },
}: PostPath): Promise<{ props?: PostProps; notFound?: boolean }> {
  const post = await getPost(postId)
  if (!post) return { notFound: true }
  return {
    props: { post } as PostProps,
  }
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{`${post.title} | Comms`}</title>
        <meta name="description" content={post.title} />
      </Head>
      <div className={styles.head}>
        <h1 className={classNames(styles.title, inter.className)}>{post.title}</h1>
        <div className={styles.info}>
          <Link
            className={styles.author}
            href={`/authors/${post.profiles.username}`}
            title={`${post.profiles.first_name} ${post.profiles.last_name} Author`}
          >
            {post.profiles.picture ? (
              <img
                className={styles.authorImage}
                src={getImageSrc(`/profiles/${post.profiles.username}.jpg`)}
                alt={`${post.profiles.first_name} Image`}
                width={32}
                height={32}
              />
            ) : (
              <Image
                className={styles.authorImage}
                src={'/default.jpg'}
                alt={`${post.profiles.first_name} Image`}
                width={32}
                height={32}
              />
            )}
            <p
              className={classNames(styles.name, inter.className)}
            >{`${post.profiles.first_name} ${post.profiles.last_name}`}</p>
          </Link>
          <p className={classNames(styles.time, roboto.className)}>
            {getDateString(new Date(post.created_at))} · {post.read_time} min read
          </p>
        </div>
      </div>
      <Viewer content={post.content as JSONContent} />
    </>
  )
}
