import express from "express";
import cors from "cors";
import {promises as fs} from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const port = process.env.SERVER_PORT;

const courses = await loadCourses();

async function loadCourses() {
    try {
        const data = await fs.readFile('./courses.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to load course materials:', error);
        return [];
    }
}

async function requestGpt(message) {
    if (!message) {
        throw new Error('Input message is required.');
    }

    const url = process.env.RAPIDAPI_GPT_URL || 'https://chatgpt-api8.p.rapidapi.com/';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.RAPIDAPI_GPT_HOST || 'chatgpt-api8.p.rapidapi.com'
        },
        body: JSON.stringify([{
                content: message,
                role: 'user'
            }]
        )
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching GPT response:', error);
        throw error;
    }
}

app.get('/getGptResponse', async (req, res) => {
    try {
        const message = req.query.userInput;
        const data = await requestGpt(message);
        res.json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.get('/course-materials', async (req, res) => {
    try {
        const courseCode = req.query.courseCode.toUpperCase();
        const course = courses.find(c => c.courseCode === courseCode);

        if (course) {
            res.json(course);
        } else {
            res.status(404).send('Course not found');
        }
    } catch (error) {
        console.error('Failed to fetch course materials:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/search-books', async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm;
        if (!searchTerm) {
            return res.status(400).send('Search term is required');
        }

        const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&key=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching books from Google:', error);
        res.status(500).send('Internal Server Error');
    }
});


const server = app.listen(port, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`🚀 Server listening at http://${host}:${port}`);
});
