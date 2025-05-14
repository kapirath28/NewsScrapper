const express = require('express');;
const app = express();
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const server = http.createServer(app);
require('dotenv').config();

let news;

async function getNews(){
    const data = await fetch (`https://newsdata.io/api/1/news?apikey=${process.env.API_KEY}&country=in&language=en&category=politics`, {
      method : "GET",
    })
    const res = await data.json();
    news = res.results;
}

const io = new Server(server, {
    cors : {
        origin : "http://localhost:5173",
        methods : ["GET", "POST"]
    }
})

io.on('connection', async (socket) => {
    await getNews();
    io.emit('getNews', (news));
})

app.use(cors());

app.get('/', (req, res) => {
    res.send("This is homepage");
})

server.listen(3000, () => {
    console.log("server connected on port 3000")
})