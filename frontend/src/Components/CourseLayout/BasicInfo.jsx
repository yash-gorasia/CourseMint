import React from 'react';
import { HiTag, HiCollection, HiClock, HiOutlineVideoCamera, HiOutlineDocumentText } from 'react-icons/hi';

const BasicInfo = ({ course }) => {
    const courseName = course?.courseOutput?.courseName || 'N/A';
    const description = course?.courseOutput?.description || 'No description available';
    const category = course?.category || 'N/A';
    const level = course?.level || 'N/A';
    const duration = course?.courseOutput?.duration || 'N/A';
    const noOfChapters = course?.courseOutput?.numberOfChapters || 'N/A';
    const videoIncluded = course?.courseOutput?.videoIncluded ? 'Yes' : 'No';

    return (
        <div className="p-4 sm:p-6 md:p-10 border rounded-xl shadow-sm mt-5 bg-white max-w-full md:max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                <div>
                    <h2 className="font-bold text-xl sm:text-2xl mb-2">{courseName}</h2>
                    <p className="text-sm sm:text-md text-gray-500">{description}</p>
                </div>
                <div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <HiTag className="text-gray-500" />
                            <span className="font-semibold">Category:</span>
                            <span className="ml-1">{category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HiCollection className="text-gray-500" />
                            <span className="font-semibold">Level:</span>
                            <span className="ml-1">{level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HiClock className="text-gray-500" />
                            <span className="font-semibold">Duration:</span>
                            <span className="ml-1">{duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HiOutlineDocumentText className="text-gray-500" />
                            <span className="font-semibold">No Of Chapters:</span>
                            <span className="ml-1">{noOfChapters}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HiOutlineVideoCamera className="text-gray-500" />
                            <span className="font-semibold">Video Included:</span>
                            <span className="ml-1">{videoIncluded}</span>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center md:justify-end">
                        <button
                            className="w-full md:w-auto px-8 md:px-36 inline-block rounded border border-green-600 bg-green-500 py-3 font-mono font-semibold text-white shadow-sm transition-colors hover:bg-green-700 cursor-pointer"
                        >
                            Start
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInfo;
