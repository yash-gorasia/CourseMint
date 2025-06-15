import React from 'react'
import CategoryList from '../../utils/CategoryList'
import { useSelector, useDispatch } from 'react-redux'
import { setCourseCategory } from '../../redux/courseSlice'

const SelectCategory = () => {
  const dispatch = useDispatch();
  const courseCategory = useSelector(state => state.course.courseCategory);

  return (
    <div className='grid grid-cols-3 gap-10 md:px-20 px-10'>
      {CategoryList.map(item => (
        <div 
        key={item.id}
         className={`flex flex-col p-5 border border-gray-300 items-center justify-center rounded-xl cursor-pointer hover:border-green-600 hover:bg-green-50 ${courseCategory === item.name && 'border-green-600 bg-green-50'}`}
         onClick={() => dispatch(setCourseCategory(item.name))}
         >
            <img src={item.icon} alt="icon" width={80} height={80}/>
            <h2>{item.name}</h2>
        </div>
      ))}
    </div>
  )
}

export default SelectCategory
