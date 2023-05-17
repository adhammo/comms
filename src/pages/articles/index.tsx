import React from 'react'
import Head from 'next/head'
import { Inter, Roboto } from 'next/font/google'
import CategoryCard from '@/components/category/category'
import styles from '@/styles/categories.module.css'
import classNames from 'classnames'

import { getAllLiveCategories } from '@/lib/posts'

const inter = Inter({
  subsets: ['latin'],
  weight: '700',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
})

export declare type CategoriesProps = {
  categories: {
    id: string
    title: string
    description: string
  }[]
}

export async function getStaticProps(): Promise<{ props: CategoriesProps }> {
  const categories = await getAllLiveCategories()
  return {
    props: { categories },
  }
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <>
      <Head>
        <title>Categories | Comms</title>
        <meta name="description" content="EECE Blog Categories" />
      </Head>
      <div className={styles.head}>
        <h1 className={classNames(styles.title, inter.className)}>Categories</h1>
        <p className={classNames(styles.description, roboto.className)}>What do you want to read about?</p>
      </div>
      <div className={styles.categories}>
        {categories.length > 0
          ? categories.map(category => (
              <CategoryCard
                key={category.id}
                id={category.id}
                title={category.title}
                description={category.description}
              />
            ))
          : '-- No categories found --'}
      </div>
    </>
  )
}
