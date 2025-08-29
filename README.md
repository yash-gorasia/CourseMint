# CourseMint

CourseMint is a full-stack web application for creating, managing, and studying courses with AI-powered content generation, quizzes, flashcards, and export features.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Usage Guide](#usage-guide)
- [AI Integration](#ai-integration)
- [PDF Export](#pdf-export)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **Course Creation**: Create courses with chapters, descriptions, and categories
- **AI Content Generation**: Generate chapters, quizzes, and flashcards using Google Gemini API
- **Quiz System**: 30-question quizzes with responsive UI
- **Flashcards**: Interactive flashcards with 3D flip animation
- **Course Sharing**: Share course links easily
- **PDF Export**: Export course content, chapters, and code examples to PDF
- **Responsive Design**: Mobile-first, clean UI
- **Error Handling**: Robust validation and user feedback

---

## Tech Stack
- **Frontend**: React, Redux Toolkit, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **AI Integration**: Google Gemini API
- **PDF Generation**: jsPDF

---

## Project Structure
```
CourseMint/
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── Config/
│   ├── Controller/
│   ├── Model/
│   ├── Route/
│   └── routes/
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   └── configs/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Setup & Installation

### Prerequisites
- Node.js & npm
- MongoDB

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

#### Backend (`backend/.env`)
Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/course-mint
```

#### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend` directory with the following variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_GEMINI_API_KEY=your_google_gemini_api_key
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_HOST_NAME=http://localhost:5173
```

**Variable Descriptions:**
- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk authentication publishable key
- `VITE_GEMINI_API_KEY`: Google Gemini API key for AI content generation
- `VITE_YOUTUBE_API_KEY`: YouTube Data API key for video integration
- `VITE_HOST_NAME`: Frontend host URL

**Note:** Never commit your `.env` files with sensitive information to version control. Use `.gitignore` to exclude them.

---

## Usage Guide
1. **Sign Up / Sign In**: Create an account or log in.
2. **Create Course**: Add course details, select category, and generate chapters.
3. **Generate Content**: Use AI to generate chapters, quizzes, and flashcards.
4. **Study & Practice**: Take quizzes, study flashcards, and review chapters.
5. **Export**: Download course content as PDF for offline use.
6. **Share**: Copy and share course links with others.

---

## AI Integration
- Uses Google Gemini API for generating:
  - Chapter content
  - Quiz questions
  - Flashcard sets
- Robust DataValidator ensures clean and valid AI responses.

---

## PDF Export
- Export course, chapters, and code examples to PDF
- Clean formatting for code blocks and content
- No horizontal overflow; readable structure

---

## Screenshots
*Add screenshots of key features and UI here*

---

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes
4. Push to your branch
5. Create a pull request

---

## License
This project is licensed under the MIT License.

---

## Contact
For questions or support, contact [Yash Gorasia](mailto:yashgorasia@gmail.com)

---

*CourseMint: AI-powered course creation and study platform.*
