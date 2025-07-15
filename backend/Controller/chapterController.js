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

const getChapterContent = async (req, res) => {
    try {
        const chapterId = req.params.chapterId;

        if (!chapterId) {
            return res.status(400).json({
                success: false,
                message: 'Chapter ID is required'
            });
        }

        // Find the chapter by ID
        const chapter = await Chapters.findById(chapterId);

        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: 'Chapter not found'
            });
        }

        res.status(200).json({
            success: true,
            chapter
        });
    } catch (error) {
        console.error('Error fetching chapter content:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chapter content',
            error: error.message
        });
    }
}

// New function to get chapters by course ID
const getChaptersByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
            });
        }

        // Find all chapters for this course
        const chapters = await Chapters.find({ courseId });

        res.status(200).json({
            success: true,
            chapters
        });
    } catch (error) {
        console.error('Error fetching chapters by course ID:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chapters',
            error: error.message
        });
    }
}

export { createChapter, getChapterContent, getChaptersByCourseId };