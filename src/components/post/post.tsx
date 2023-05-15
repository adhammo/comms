import React from 'react'
import { Inter, Roboto } from 'next/font/google'
import Link from 'next/link'
import styles from './post.module.css'
import classNames from 'classnames'

import getImageSrc from '@/lib/storage'
import { getDateString } from '@/utility/dates'

const inter = Inter({
  subsets: ['latin'],
  weight: '500',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
})

export declare type PostProps = {
  id: string
  title: string
  description: string
  createdAt: string
  category: string
  author: string
  readTime: number
}

export const Post = ({ id, title, description, createdAt, category, author, readTime }: PostProps) => {
  return (
    <Link className={styles.card} title={title} href={`/articles/${category}/${id}`}>
      <div className={styles.head}>
        <img className={styles.image} src={getImageSrc(`/posts/${id}.jpg`)} alt={`${title} Image`} />
      </div>
      <div className={styles.body}>
        <h2 className={classNames(styles.title, inter.className)}>{title}</h2>
        <p className={classNames(styles.description, roboto.className)}>{description}</p>
        <p className={classNames(styles.time, roboto.className)}>
          {getDateString(new Date(createdAt))} · {readTime} min read
        </p>
        <div className={styles.author}>{author}</div>
      </div>
    </Link>
  )
}

export default Post
