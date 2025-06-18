import Chapters from '../Model/chapterModel.js';

const createChapter = async (req, res) => {
    try {
        const { courseId, content, videoId } = req.body;

        // Validate required fields
        if (!courseId || !content || !videoId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Create a new chapter instance
        const newChapter = new Chapters({
            courseId,
            content,
            videoId
        });

        // Save the chapter to the database
        await newChapter.save();

        res.status(201).json({
            success: true,
            newChapter,
            id: newChapter._id
        });
    } catch (error) {
        console.error('Error creating chapter:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create chapter',
            error: error.message
        });
    }
}

export { createChapter };