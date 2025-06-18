import mongoose from 'mongoose';

const ChaptersSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'courselists',
        required: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed, // Equivalent to JSON column
        required: true
    },
    videoId: {
        type: String,
        default: null,
        required: true
    }

}, {
    timestamps: true
});


const Chapters = mongoose.model('chapters', ChaptersSchema);

export default Chapters;