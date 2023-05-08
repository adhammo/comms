import Head from 'next/head'
import styles from '@/styles/home.module.css'

import TipTap from '@/components/tiptap/tiptap'
import { getAllPosts, getPost } from '@/lib/posts'

export async function getServerSideProps() {
  const post = await getPost(4)
  return {
    props: { title: post.title },
  }
}

const Home = ({ title }: { title: string }) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="description" content="EECE Website" />
    </Head>
    <TipTap />
  </>
)

export default Home
