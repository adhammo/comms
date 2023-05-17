import React, { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Noto_Sans, Open_Sans, Raleway, Roboto } from 'next/font/google'
import classNames from 'classnames'
import styles from './layout.module.css'

import { navigables } from '@/config/navigation'
import MenuIcon from '@/icons/menu.icon'

export declare type LayoutProps = {
  children: (setStatus: (message: string, error: boolean) => void) => ReactNode
}

const raleway = Raleway({
  weight: '700',
  subsets: ['latin'],
})

const opensans = Open_Sans({
  weight: ['700', '500'],
  subsets: ['latin'],
})

export const Layout = ({ children }: LayoutProps) => {
  const router = useRouter()
  const [status, SetStatus] = useState({ show: false, message: '', error: false })
  const [sidebar, SetSidebar] = useState(false)
  const openSidebar = () => SetSidebar(true)
  const closeSidebar = () => SetSidebar(false)

  const [isMobile, setIsMobile] = useState(false)
  const checkForMobile = () => {
    setIsMobile(mobile => {
      if (mobile && window.innerWidth >= 700) closeSidebar()
      return window.innerWidth <= 700
    })
  }
  useEffect(() => {
    checkForMobile()
    window.addEventListener('resize', checkForMobile)
    return () => {
      window.removeEventListener('resize', checkForMobile)
    }
  }, [])

  useEffect(() => {
    closeSidebar()
  }, [router.pathname])

  useEffect(() => {
    if (status.message) {
      const timeout = setTimeout(() => {
        SetStatus(oldStatus => ({ ...oldStatus, show: false }))
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [status])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link className={styles.logo} title="Home Page" href="/">
            <Image src="/comms.svg" alt="Comms Logo" width={20} height={20} priority />
            <h1 className={classNames(styles.title, raleway.className)}>comms</h1>
          </Link>
          <nav className={styles.nav}>
            <ul className={styles.list}>
              {navigables.map(navigable => (
                <li key={navigable.name} className={styles.item}>
                  <Link
                    className={classNames(styles.link, opensans.className)}
                    title={`${navigable.name} Page`}
                    href={navigable.path}
                  >
                    {navigable.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className={styles.actions}>
          <Link className={classNames(styles.author, opensans.className)} title="Author Articles" href="/author">
            Author
          </Link>
          <button className={styles.menu} title="Open Sidebar" onClick={!sidebar ? openSidebar : undefined}>
            <MenuIcon className={styles.icon} />
          </button>
        </div>
      </header>

      <main className={classNames(styles.main, { [styles.hide]: sidebar })}>
        {children((message, error) => SetStatus({ show: true, message, error }))}
      </main>
      <footer className={styles.footer}></footer>
      {isMobile && (
        <div className={classNames(styles.sidebar, { [styles.hide]: !sidebar })}>
          <div className={styles.head}>
            <Link className={styles.logo} title="Home Page" href="/">
              <Image src="/comms.svg" alt="Comms Logo" width={20} height={20} priority />
              <h1 className={classNames(styles.title, raleway.className)}>comms</h1>
            </Link>
            <button className={styles.menu} title="Close Sidebar" onClick={sidebar ? closeSidebar : undefined}>
              <Image src="/icons/editor/close.svg" alt="Close" width={32} height={32} priority />
            </button>
          </div>
          <nav className={styles.nav}>
            <ul className={styles.list}>
              {navigables.map(navigable => (
                <li key={navigable.name} className={styles.item}>
                  <Link
                    className={classNames(styles.link, opensans.className)}
                    title={`${navigable.name} Page`}
                    href={navigable.path}
                  >
                    {navigable.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.actions}>
            <Link className={classNames(styles.author, opensans.className)} title="Author Articles" href="/author">
              Author
            </Link>
          </div>
        </div>
      )}
      <div
        className={classNames(styles.status, opensans.className, {
          [styles.show]: status.show,
          [styles.error]: status.error,
        })}
      >
        {status.message}
        <button
          className={styles.ignore}
          title="Ignore Status"
          onClick={status.show ? () => SetStatus(oldStatus => ({ ...oldStatus, show: false })) : undefined}
        >
          <Image src="/icons/editor/close.svg" alt="Close" width={18} height={18} priority />
        </button>
      </div>
    </>
  )
}

export default Layout
