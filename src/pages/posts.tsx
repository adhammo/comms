import React from 'react'
import { getAllPosts } from '@/lib/posts'

export declare type PostsProps = {
  posts: {
    id: number
    title: string
  }[]
}

export async function getServerSideProps(): Promise<{ props: PostsProps }> {
  const posts = await getAllPosts()
  return {
    props: { posts },
  }
}

export default function Posts({ posts }: PostsProps) {
  return (
    <div>
      {posts.map(post => (
        <p>{post.title}</p>
      ))}
    </div>
  )
}
