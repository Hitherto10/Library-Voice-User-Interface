import express from "express";
import cors from "cors";
import { promises as fs } from "fs";

const app = express();
app.use(cors());

const port = 8080;

async function requestGpt(message) {
    const url = 'https://chatgpt-api8.p.rapidapi.com/';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '24c45f84bemsh131811b4b98636dp1baed9jsn0280fb24c708', // API KEY BEING USED
            'X-RapidAPI-Host': 'chatgpt-api8.p.rapidapi.com'
        },
        body: JSON.stringify([{
                content: message,
                role: 'user'
            }]
        )
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result; 
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
        const data = await fs.readFile('./courses.json', 'utf8');
        const courses = JSON.parse(data);
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


var server = app.listen(port, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("REST API app listening at http://%s:%s", host, port);
})
