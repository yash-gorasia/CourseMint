import React from 'react'
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedOption } from '../../redux/feature/courseInputSlice';

const difficultyOptions = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advance', label: 'Advance' },
];

const hoursOptions = [
    { value: '1 Hour', label: '1 Hour' },
    { value: '2 Hours', label: '2 Hours' },
    { value: 'More than 3 Hours', label: 'More than 3 Hours' },
]

const videoOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
]

const SelectOption = () => {
    const dispatch = useDispatch();
    const { selectedOptions } = useSelector(state => state.courseInput);

    // Extract specific options from the redux state or set defaults
    const optionDiff = selectedOptions.difficulty || null;
    const optionHour = selectedOptions.duration || null;
    const optionVideo = selectedOptions.includeVideo || null;
    const chapters = selectedOptions.chapters || '';    // Update specific option in Redux
    const updateOption = (key, value) => {
        dispatch(setSelectedOption({ key, value }));
    };

    return (
        <div className='px-10 md:px-20 lg:px-44'>
            <div className='grid grid-cols-2 gap-10'>
                <div>
                    <label className='text-sm font-semibold'>Difficulty Level</label>
                    <Select
                        value={optionDiff}
                        onChange={(value) => updateOption('difficulty', value)}
                        options={difficultyOptions}
                    />
                </div>
                <div>
                    <label className='text-sm font-semibold'>Course Duration</label>
                    <Select
                        value={optionHour}
                        onChange={(value) => updateOption('duration', value)}
                        options={hoursOptions}
                    />
                </div>
                <div>
                    <label className='text-sm font-semibold'>Add Video</label>
                    <Select
                        value={optionVideo}
                        onChange={(value) => updateOption('includeVideo', value)}
                        options={videoOptions}
                    />
                </div>
                <div className='flex flex-col'>
                    <label className='text-sm font-semibold mb-1'>Number Of Chapters</label>
                    <input
                        type="number"
                        className='border border-gray-300 py-1 rounded'
                        value={chapters}
                        onChange={(e) => updateOption('chapters', e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default SelectOption
