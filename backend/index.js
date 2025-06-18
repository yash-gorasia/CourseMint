import express from 'express';
import cors from 'cors';
import connectDB from './Config/db.js';
import dotenv from 'dotenv';
import courseRoute from './Route/courseRoute.js';
import chapterRoute from './Route/chapterRoute.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors(
    {origin: 'http://localhost:5173',} // Adjust this to your frontend URL
));
app.use(express.json());

app.use('/api/course', courseRoute);
app.use('/api/chapter', chapterRoute);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
