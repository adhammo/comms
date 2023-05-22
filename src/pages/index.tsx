import Head from 'next/head'
import styles from '@/styles/home.module.css'
import { Inter, Open_Sans, Raleway, Roboto } from 'next/font/google'
import TipTap from '@/components/tiptap/tiptap'
import { SyncLoader } from 'react-spinners'
import Image from 'next/image'
import classNames from 'classnames'
import Link from 'next/link'

const raleway = Raleway({
  subsets: ['latin'],
  weight: '700',
})

const opensans = Open_Sans({
  weight: ['500'],
  subsets: ['latin'],
})

export const Home = () => (
  <>
    <Head>
      <title>EECE Blog Website | Comms</title>
      <meta name="description" content="EECE Website" />
    </Head>
    <div className={styles.intro}>
      <div className={styles.imageContainer}>
        <Image className={styles.image} src="/department.jpg" alt="EECE Department" width={400} height={400} />
      </div>
      <div className={styles.container}>
        <h1 className={classNames(styles.title, raleway.className)}>comms</h1>
        <p className={classNames(styles.description, opensans.className)}>
          The place to share your thoughts, experiences, and projects in all EECE fields
        </p>
        <Link className={classNames(styles.author, opensans.className)} title="Author Articles" href="/author">
          Join now and start writing articles
        </Link>
      </div>
    </div>
    <div className={styles.learn}>
      <h2 className={classNames(styles.title, raleway.className)}>How it works?</h2>
      <iframe
        className={styles.video}
        src="https://drive.google.com/file/d/1leTrFCeSrEP8f32RUktVtCedwhjKY5o1/preview"
        width="800"
        height="450"
        allow="autoplay"
        allowFullScreen
      ></iframe>
    </div>
  </>
)

export default Home
