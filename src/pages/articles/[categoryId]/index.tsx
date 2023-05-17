import React from 'react'
import Head from 'next/head'
import { Inter, Roboto } from 'next/font/google'
import PostCard from '@/components/post/post'
import styles from '@/styles/category.module.css'
import classNames from 'classnames'

import { getAllLiveCategories, getCategory } from '@/lib/posts'

const inter = Inter({
  subsets: ['latin'],
  weight: '700',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
})

export declare type CategoryPath = { params: { categoryId: string } }

export declare type CategoryProps = {
  category: {
    id: string
    title: string
    description: string
    posts: {
      id: string
      profiles: { username: string; first_name: string; last_name: string }
      created_at: string
      title: string
      description: string
      read_time: number
    }[]
  }
}

export async function getStaticPaths(): Promise<{ paths: CategoryPath[]; fallback: string }> {
  const categories = await getAllLiveCategories()
  return {
    paths: categories.map(category => ({ params: { categoryId: category.id } })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({
  params: { categoryId },
}: CategoryPath): Promise<{ props: CategoryProps; revalidate: number }> {
  const category = await getCategory(categoryId)
  return {
    props: { category } as CategoryProps,
    revalidate: 600,
  }
}

export default function Category({ category }: CategoryProps) {
  return (
    <>
      <Head>
        <title>{`${category.title} | Comms`}</title>
        <meta name="description" content={`${category.title} Articles`} />
      </Head>
      <div className={styles.head}>
        <h1 className={classNames(styles.title, inter.className)}>{category.title}</h1>
        <p className={classNames(styles.description, roboto.className)}>{category.description}</p>
      </div>
      <div className={styles.posts}>
        {category.posts.length > 0
          ? category.posts.map(post => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                description={post.description}
                createdAt={post.created_at}
                category={category.id}
                profiles={post.profiles}
                readTime={post.read_time}
              />
            ))
          : '-- No articles found in this category --'}
      </div>
    </>
  )
}
