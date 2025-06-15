import React from 'react'
import logo from '/assets/logo.png'
import { HiOutlineHome, HiOutlineSquare3Stack3D, HiOutlinePower } from "react-icons/hi2";
import { useLocation, Link } from 'react-router-dom';

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const Menu = [
    {
      id: 1,
      name: "Home",
      icon: <HiOutlineHome className='text-2xl' />,
      path: "/dashboard"
    },
    {
      id: 2,
      name: "Explore",
      icon: <HiOutlineSquare3Stack3D className='text-2xl' />,
      path: "/dashboard/explore"
    },
    {
      id: 3,
      name: "LogOut",
      icon: <HiOutlinePower className='text-2xl' />,
      path: "/dashboard/logout"
    }
  ]

  return (
    <div className='fixed h-full md:w-64 p-5 shadow-neutral-700 shadow-md'>
      <div className='flex items-center justify-center'>
        <img src={logo} alt="logo" width={160} />
      </div>
      <hr className='my-5' />

      <ul>
        {
          Menu.map((item) => (
            <Link
              to={item.path}
              key={item.id}
              className={`flex items-center gap-2 text-gray-700 p-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg mb-3 ${item.path === currentPath ? 'bg-gray-100 text-black' : ''}`}
            >
              <div>{item.icon}</div>
              <h2>{item.name}</h2>
            </Link>
          ))
        }
      </ul>
    </div>
  )
}

export default SideBar
