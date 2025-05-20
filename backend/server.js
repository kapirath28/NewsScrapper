const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const server = http.createServer(app);
require('dotenv').config();
const {getAllNews, getStoredNews} = require('./controller.js')



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
    console.log('Client connected');
    
    try {
        await getAllNews();
        const news = getStoredNews();
        io.emit('getNews', news);
    } catch (error) {
        console.error('Error in connection handler:', error);
        socket.emit('error', { message: 'Failed to fetch news' });
    }

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
})

// Error handling for the server
server.on('error', (error) => {
    console.error('Server error:', error);
});

app.use(cors());

app.get('/', (req, res) => {
    res.send("This is homepage");
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server connected on port ${PORT}`);
})