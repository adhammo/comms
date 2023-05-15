import React from 'react'
import Head from 'next/head'
import { Inter, Roboto } from 'next/font/google'
import { JSONContent } from '@tiptap/react'
import Viewer from '@/components/tiptap/viewer'
import styles from '@/styles/post.module.css'

import classNames from 'classnames'
import { getAllPosts, getPost } from '@/lib/posts'
import { Json } from '@/lib/database'
import { getDateString } from '@/utility/dates'

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
    author: string
    category: string
    created_at: string
    title: string
    description: string
    content: Json
    read_time: number
  }
}

export async function getStaticPaths(): Promise<{ paths: PostPath[]; fallback: boolean }> {
  const posts = await getAllPosts()
  return {
    paths: posts.map(post => ({ params: { categoryId: post.category, postId: post.id } })),
    fallback: false,
  }
}

export async function getStaticProps({ params: { postId } }: PostPath): Promise<{ props: PostProps }> {
  const post = await getPost(postId)
  return {
    props: { post },
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
        <p className={classNames(styles.time, roboto.className)}>
          {post.author} · {getDateString(new Date(post.created_at))} · {post.read_time} min read
        </p>
      </div>
      <Viewer content={post.content as JSONContent} />
    </>
  )
}
