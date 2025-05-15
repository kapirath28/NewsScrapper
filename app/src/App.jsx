import { useEffect, useState, useRef } from 'react'
import './App.css';
import {io} from 'socket.io-client'
import NewsContainer from './components/NewsContainer';

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io('http://localhost:3000/');
    socket.on('getNews', (news) => {
      setNews(news);
      setLoading(false);
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  return <>
  {
    loading ? <div style={{background : "transparent"}}><img src = {"Loading.svg"}/></div> : null
  }
  <NewsContainer news={news} Genre={"Politics !!!"}/>
  <NewsContainer news={news} Genre={"Technology !!!"}/>
  <NewsContainer news={news} Genre={"Entertainment !!!"}/>

  </>
}

export default App
