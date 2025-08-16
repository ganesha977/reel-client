import React from 'react'
import Reel from './Reel.jsx'
import { useSelector } from 'react-redux'

const Reels = () => {
  const { reels } = useSelector(store => store.reel)

  return (
    <div className='w-full'>
      {
        reels.map((reel) => (
          <Reel key={reel._id} reel={reel} />
        ))
      }
    </div>
  )
}

export default Reels
