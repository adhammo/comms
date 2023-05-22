import Head from 'next/head'
import Link from 'next/link'
import { Inter, Roboto } from 'next/font/google'
import styles from '@/styles/links.module.css'
import classNames from 'classnames'
import Card from '@/components/card/card'

const inter = Inter({
  subsets: ['latin'],
  weight: '700',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
})

export const Home = () => (
  <>
    <Head>
      <title>Useful Links | Comms</title>
      <meta name="description" content="EECE Website" />
    </Head>
    <div className={styles.head}>
      <h1 className={classNames(styles.title, inter.className)}>Links</h1>
      <p className={classNames(styles.description, roboto.className)}>Useful tools and presentations links</p>
    </div>
    <div className={styles.links}>
      {[
        {
          href: 'https://drive.google.com/drive/folders/11MN1u66AWSC35J97v2uRGFjRKKLHCEDU',
          title: 'Graduation Projects Resources',
          description:
            'Materials for analog/digital IC design, embedded systems, and communications',
          imgSrc: '/graduation.jpg',
        },
      ].map((link, index) => (
        <Card key={index} title={link.title} description={link.description} href={link.href} imgSrc={link.imgSrc} />
      ))}
    </div>
  </>
)

export default Home
