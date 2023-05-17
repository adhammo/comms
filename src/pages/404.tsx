import Head from 'next/head'
import styles from '@/styles/404.module.css'
import classNames from 'classnames'
import { Open_Sans, Raleway } from 'next/font/google'

const opensans = Open_Sans({
  weight: ['400', '500'],
  subsets: ['latin'],
})

export const Home = () => (
  <>
    <Head>
      <title>404 Not Found | Comms</title>
      <meta name="description" content="404 Not Found" />
    </Head>
    <div className={styles.container}>
      <div className={styles.body}>
        <h3 className={classNames(styles.code, opensans.className)}>404</h3>
        <h2 className={classNames(styles.status, opensans.className)}>Not Found</h2>
        <p className={classNames(styles.message, opensans.className)}>Oops! No resource was found on this page.</p>
      </div>
    </div>
  </>
)

export default Home
