import React from 'react'
import {HiOutlineClock} from 'react-icons/hi2'

const ChapterListCard = ({chapter, index}) => {
  const chapterName = chapter?.chapterName || chapter?.chapter_name;
  const duration = chapter?.duration 
  return (
    <div className='grid grid-cols-5 p-4 items-center border-b '>
      <div>
        <h2 className='w-8 h-8 p-1 bg-green-500 text-white text-center rounded-full'>{index+1}</h2>
      </div>
      <div className='col-span-4'>
        <h2 className='font-medium'>{chapterName}</h2>
        <h2 className='flex items-center gap-2 text-sm text-green-700'><HiOutlineClock/>{duration}</h2>
      </div>
    </div>
  )
}

export default ChapterListCard
