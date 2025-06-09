require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const fetch = require('node-fetch');
const server = http.createServer(app);

// Temporary logging to debug API key
console.log('API Key length:', process.env.API_KEY?.length);
console.log('API Key first 4 chars:', process.env.API_KEY?.substring(0, 4));


async function getNews(){
    try {
        if (!process.env.API_KEY) {
            throw new Error('API key is not configured');
        }
        
        const data = await fetch(`https://newsdata.io/api/1/news?apikey=${process.env.API_KEY}`);
        const res = await data.json();
        
        if (res.status === 'error') {
            console.error('API Error:', res);
            throw new Error(res.message);
        }
        
        news = res.results;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
}

const io = new Server(server, {
    cors : {
        origin : "http://localhost:5173",
        methods : ["GET", "POST"]
    }
})

// Error handling for socket.io
io.on('error', (error) => {
    console.error('Socket.IO error:', error);
});

io.on('connection', async (socket) => {
    try {
        await getNews();
        socket.emit('getNews', news);
    } catch (error) {
        socket.emit('error', { message: error.message });
    }
})

// Error handling for the server
server.on('error', (error) => {
    console.error('Server error:', error);
});

app.use(cors());

app.get('/', (req, res) => {
    res.send("This is homepage");
})

app.get('/news', async (req, res) => {
    try {
        await getNews();
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.listen(3000, () => {
    console.log("Server connected on port 3000");
})