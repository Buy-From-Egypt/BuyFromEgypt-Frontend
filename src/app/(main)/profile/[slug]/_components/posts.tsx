import { TimelineItem } from '@/components/main/timeline'
import React from 'react'

function Posts() {
  return (
  Array(8).fill(0).map((_, i) => (
     <TimelineItem key={i+1-1} />
  ))
  )
}

export default Posts