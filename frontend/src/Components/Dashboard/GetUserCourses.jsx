import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useGetCourseByUserEmailQuery, useDeleteCourseMutation } from '../../redux/api/courseSlice.js';
import { HiBookOpen, HiOutlineChartBar, HiAcademicCap, HiTag, HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const GetUserCourses = () => {
    const { user } = useUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    const [deletingCourseId, setDeletingCourseId] = useState(null);

    // Use the hook only if the email exists
    const { data, isLoading, refetch } = useGetCourseByUserEmailQuery(userEmail, {
        skip: !userEmail, // Prevent firing query until email is ready
        refetchOnMountOrArgChange: true, // Always refetch when component mounts or arguments change
    });

    const [deleteCourse] = useDeleteCourseMutation();

    // Add a refetch effect on component mount
    useEffect(() => {
        if (userEmail) {
            refetch();
        }
    }, [refetch, userEmail]);

    const [courseList, setCourseList] = useState(data?.courses || []);

    // Sync courseList with data when data changes
    useEffect(() => {
        setCourseList(data?.courses || []);
    }, [data]);

    // Function to handle course deletion
    const handleDeleteCourse = async (courseId, e) => {
        e.stopPropagation();

        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                setDeletingCourseId(courseId);
                await deleteCourse(courseId).unwrap();
                // Update the course list after deletion
                setCourseList((prevCourses) => prevCourses.filter(course => course._id !== courseId));
                toast.success('Course deleted successfully');
                // refetch(); // Refetch the courses list after deletion
            } catch (error) {
                console.error('Failed to delete course:', error);
                toast.error(error?.data?.message || 'Failed to delete course');
            } finally {
                setDeletingCourseId(null);
            }
        }
    };

    // Individual Course Card Component (inline)
    const CourseCard = ({ course }) => {
        // Handle different naming conventions from AI response
        const courseName = course?.courseOutput?.courseName || course?.courseOutput?.course_name || course?.name;
        const category = course?.category;
        const noOfChapters = course?.courseOutput?.chapters.length || 0;
        const difficulty = course?.courseOutput?.level || course?.level;
        const isDeleting = deletingCourseId === course._id;

        return (
            <div
                id={`course-${course?._id}`}
                className={`relative border shadow-md rounded-lg p-5 bg-white flex flex-col gap-4 hover:scale-105 transition-all cursor-pointer ${isDeleting ? 'opacity-50' : ''}`}>
                <button
                    className="absolute bottom-3 right-3 text-red-400 hover:text-red-500 cursor-pointer"
                    title="Delete"
                    onClick={(e) => handleDeleteCourse(course?._id, e)}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <span className="inline-block w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <HiOutlineTrash size={22} />
                    )}
                </button>
                <Link to={`/course/${course._id}`} key={course._id}>
                    <h2 className="font-bold text-xl flex items-center gap-2 text-gray-800">
                        <HiBookOpen className="text-green-500" size={24} />
                        {courseName}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-600">
                        <HiTag className="text-green-500" size={20} />
                        <span className="font-medium">{category} Category</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <HiOutlineChartBar className="text-green-500" size={20} />
                        <span className="font-medium">{noOfChapters} Chapters</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <HiAcademicCap className="text-green-500" size={20} />
                        <span className="capitalize">{difficulty}</span>
                    </div>
                </Link>
            </div >
        );
    };

    return (
        <div className='pl-8'>
            <div className="flex justify-between items-center mb-3">
                <h2 className='font-medium text-xl'>My Courses</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                {courseList.map((course) => (

                    <CourseCard course={course} key={course._id} />
                ))}
            </div>

        </div>
    )
}

export default GetUserCourses
