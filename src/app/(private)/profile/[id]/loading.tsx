import Spinner from '@/components/Spinner'
import React from 'react'

function Loading() {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
        <Spinner/>
    </div>
  )
}

export default Loading