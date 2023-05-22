import React from 'react'
import { Inter, Roboto } from 'next/font/google'
import Link from 'next/link'
import styles from './card.module.css'
import classNames from 'classnames'
import Image from 'next/image'

const inter = Inter({
  subsets: ['latin'],
  weight: '500',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
})

export declare type CardProps = {
  href: string
  title: string
  description: string
  imgSrc: string
}

export const Card = ({ href, title, description, imgSrc }: CardProps) => {
  return (
    <Link className={styles.card} title={title} href={href} target='_blank'>
      <div className={styles.head}>
        <Image className={styles.image} src={imgSrc} alt={`${title} Image`} width={400} height={400} />
      </div>
      <div className={styles.body}>
        <h2 className={classNames(styles.title, inter.className)}>{title}</h2>
        <p className={classNames(styles.description, roboto.className)}>{description}</p>
      </div>
    </Link>
  )
}

export default Card
