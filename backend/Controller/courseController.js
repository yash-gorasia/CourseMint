import CourseList from "../Model/courseListModel.js";

const createCourse = async (req, res) => {
    try {
        const { courseId, name, category, level, courseOutput, userName } = req.body;

        // Validate required fields
        if (!courseId || !name || !category || !level || !courseOutput) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Create a new course instance
        const newCourse = new CourseList({
            courseId,
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
            data: newCourse
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

export { createCourse };