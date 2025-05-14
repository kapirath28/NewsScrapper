import { useEffect, useState } from 'react'
import './App.css';
import {io} from 'socket.io-client'
import {v4 as uuid} from 'uuid';

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io('http://localhost:3000/');
    socket.on('getNews', (news) => {
      setNews(news);
      setLoading(false);
    })
  }, [])

  return <>
  <div>News !!!</div>
  {
    loading ? <div style={{background : "transparent"}}><img src = {"Loading.svg"}/></div> : null
  }
  <div style={{display : 'flex', gap : "20px"}}>
  {
    news.map(n => {
      return <div key={uuid()}>
        <p>
        {n.title}
        </p>
        <img src={n.image_url} alt="news image" style={{height : "100px", width : "100px"}}/>
      </div>
    })
  }
  </div>
  </>
}

export default App
