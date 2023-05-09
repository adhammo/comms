import React, { ReactNode } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Open_Sans, Raleway } from 'next/font/google'
import classNames from 'classnames'
import styles from './layout.module.css'

import { navigables } from '@/config/navigation'
import MenuIcon from '@/icons/menu.icon'

export declare type LayoutProps = {
  children: ReactNode
}

const raleway = Raleway({
  weight: '700',
  subsets: ['latin'],
})

const opensans = Open_Sans({
  weight: '700',
  subsets: ['latin'],
})

export const Layout = ({ children }: LayoutProps) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <header className={styles.header}>
      <div className={styles.container}>
        <Link className={styles.logo} href="/">
          <Image src="/comms.svg" alt="Comms Logo" width={20} height={20} priority />
          <h1 className={classNames(styles.title, raleway.className)}>comms</h1>
        </Link>
        <nav className={styles.nav}>
          <ul className={styles.list}>
            {navigables.map(navigable => (
              <li key={navigable.name} className={styles.item}>
                <Link className={classNames(styles.link, opensans.className)} href={navigable.path}>
                  {navigable.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={styles.actions}>
        <Link className={classNames(styles.author, opensans.className)} href="/author">
          Author
        </Link>
        <button className={styles.menu} onClick={() => console.log('sdsd')}>
          <MenuIcon className={styles.icon} />
        </button>
      </div>
    </header>
    <main className={styles.main}>{children}</main>
    <footer className={styles.footer}>
    </footer>
  </>
)

export default Layout
