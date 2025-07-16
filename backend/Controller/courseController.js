import CourseList from "../Model/courseListModel.js";
import Chapters from "../Model/chapterModel.js"; // Make sure this path is correct
// Ensure that courseListModel.js exports a valid Mongoose model, e.g.:
// import mongoose from "mongoose";
// const courseListSchema = new mongoose.Schema({ ... });
// export default mongoose.model("CourseList", courseListSchema);

const createCourse = async (req, res) => {
    try {
        const { name, category, level, courseOutput, userEmail } = req.body;

        // Validate required fields
        if (!name || !category || !level || !courseOutput || !userEmail) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Create a new course instance
        const newCourse = new CourseList({
            name,
            category,
            level,
            courseOutput,
            userEmail: userEmail || null // Default to null if not provided
        });

        // Save the course to the database
        await newCourse.save();

        res.status(201).json({
            success: true,
            data: newCourse,
            id: newCourse._id
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create course',
            error: error.message
        });
    }
}

const getCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        // Find the course by ID
        const course = await CourseList.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch course',
            error: error.message
        });
    }
}

const getCourseByUserEmail = async (req, res) => {
    const { userEmail } = req.body;

    if (!userEmail) {
        return res.status(400).json({
            success: false,
            message: 'User email is required'
        });
    }

    try {
        const courses = await CourseList.find({ userEmail });

        if (courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No courses found for this user'
            });
        }

        res.status(200).json({
            success: true,
            courses
        });
    }
    catch (error) {
        console.error('Error fetching courses by user email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch courses',
            error: error.message
        });
    }
}

const deleteCourse = async (req, res) => {
    const { courseId } = req.body;

    if (!courseId) {
        return res.status(400).json({
            success: false,
            message: 'Course ID required.'
        });
    }

    try {
        const course = await CourseList.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Delete all chapters related to this course
        await Chapters.deleteMany({ courseId });

        // Delete the course itself
        await CourseList.findByIdAndDelete(courseId);

        res.status(200).json({
            success: true,
            message: 'Course and related chapters deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete course',
            error: error.message
        });
    }
}

export { createCourse, getCourse, getCourseByUserEmail, deleteCourse };