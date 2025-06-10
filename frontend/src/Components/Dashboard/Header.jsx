import React from 'react'
import { UserButton } from '@clerk/clerk-react'
import logo1 from '../../assets/logo1.png'

const Header = () => {
  return (
    <div className='flex justify-between items-center p-5 shadow-sm'>
      <img src={logo1} width={40} alt="logo" />
      <UserButton />
    </div>
  )
}

export default Header
