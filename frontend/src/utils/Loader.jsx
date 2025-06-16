import React from 'react'
import loader from '/assets/loader.gif'

const Loader = () => {
  return (
    <div>
      <img src={loader} alt="Loading..." width={250} height={100} className='rounded-md' />
    </div>
  )
}

export default Loader
