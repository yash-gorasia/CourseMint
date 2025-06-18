import CourseList from "../Model/courseListModel.js";
// Ensure that courseListModel.js exports a valid Mongoose model, e.g.:
// import mongoose from "mongoose";
// const courseListSchema = new mongoose.Schema({ ... });
// export default mongoose.model("CourseList", courseListSchema);

const createCourse = async (req, res) => {
    try {
        const { name, category, level, courseOutput, userName } = req.body;

        // Validate required fields
        if (!name || !category || !level || !courseOutput) {
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
            userName: userName || null // Default to null if not provided
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

export { createCourse, getCourse };