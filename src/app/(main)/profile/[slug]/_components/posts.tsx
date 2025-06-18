import { TimelineItem } from '@/components/main/timeline'
import React from 'react'

import { Post } from '@/store/apis/posts'

function Posts() {
  const mockPost: Post = {
    postId: 'mock-post-id',
    title: 'Mock Post Title',
    content: 'This is a mock post',
    cloudFolder: 'mock-cloud-folder',
    userId: 'mock-user-id',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 0,
    reviewCount: 0,
    comments_count: 0,
    user: {
      userId: 'mock-user-id',
      name: 'Mock User',
      profileImage: '/images/user-placeholder.png'
    },
    images: []
  };

  return (
    Array(8).fill(0).map((_, i) => (
      <TimelineItem key={i} post={mockPost} />
    ))
  )
}

export default Posts