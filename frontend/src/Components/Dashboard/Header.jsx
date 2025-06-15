import React from 'react'
import { UserButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import logo1 from '/assets/logo1.png'

const Header = () => {
  return (
    <div className='flex justify-between items-center p-5 shadow-sm'>
      <Link to="/dashboard">
        <img src={logo1} width={40} alt="logo" />
      </Link>
      <UserButton />
    </div>
  )
}

export default Header
