import React from 'react'
import { Inter, Roboto } from 'next/font/google'
import Link from 'next/link'
import styles from './category.module.css'
import classNames from 'classnames'

import getImageSrc from '@/lib/storage'

const inter = Inter({
  subsets: ['latin'],
  weight: '500',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
})

export declare type CategoryProps = {
  id: string
  title: string
  description: string
}

export const Category = ({ id, title, description }: CategoryProps) => {
  return (
    <Link className={styles.card} title={`${title} Articles`} href={`/articles/${id}`}>
      <div className={styles.head}>
        <img className={styles.image} src={getImageSrc(`/categories/${id}.jpg`)} alt={`${title} Image`} />
      </div>
      <div className={styles.body}>
        <h2 className={classNames(styles.title, inter.className)}>{title}</h2>
        <p className={classNames(styles.description, roboto.className)}>{description}</p>
      </div>
    </Link>
  )
}

export default Category
