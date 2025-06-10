import React, { useState } from 'react'
import logo from '../../assets/logo.png';
import { useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const { session } = useClerk()
    const navigate = useNavigate()

    const handleGetStarted = () => {
        navigate('/sign-up')  
    }


    return (
        <>
            <div className='flex justify-between p-3 shadow-md mb-2'>
                <img src={logo} alt="CourseMint" width={100} />
                {session ? (
                    <div className='flex items-center'>
                        <span className='mr-2 font-bold'>Welcome back!</span>
                        <button
                            className='bg-green-500 text-white font-bold p-2 rounded-md cursor-pointer'
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <button
                        className='bg-green-500 text-white font-bold p-2 rounded-md cursor-pointer'
                        onClick={handleGetStarted}
                    >
                        Get started
                    </button>
                )}
            </div>


        </>
    )
}

export default Header
