import mongoose from 'mongoose';

const CourseListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    includeVideo: {
        type: Boolean,
        default: true,
        required: true
    },
    courseOutput: {
        type: mongoose.Schema.Types.Mixed, // Equivalent to JSON column
        required: true
    },
    userName: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});



const CourseList = mongoose.model('courselists', CourseListSchema);

export default CourseList;
