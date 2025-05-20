import { useEffect, useState } from 'react'
import './App.css';
import {io} from 'socket.io-client'
import NewsContainer from './components/NewsContainer';

function App({ searchTerm }) {
  const [news, setNews] = useState({
    politics: [],
    technology: [],
    entertainment: []
  });
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

  const filteredNews = {
    politics: searchTerm ? news.politics.filter(item => 
      item.category.toLowerCase() === searchTerm.toLowerCase()
    ) : news.politics,
    technology: searchTerm ? news.technology.filter(item => 
      item.category.toLowerCase() === searchTerm.toLowerCase()
    ) : news.technology,
    entertainment: searchTerm ? news.entertainment.filter(item => 
      item.category.toLowerCase() === searchTerm.toLowerCase()
    ) : news.entertainment
  };

  return <>
  {
    loading ? <div style={{background : "transparent"}}><img src = {"Loading.svg"}/></div> : null
  }
  {filteredNews.politics.length > 0 && <NewsContainer news={filteredNews.politics} Genre={"Politics !!!"}/>}
  {filteredNews.technology.length > 0 && <NewsContainer news={filteredNews.technology} Genre={"Technology !!!"}/>}
  {filteredNews.entertainment.length > 0 && <NewsContainer news={filteredNews.entertainment} Genre={"Entertainment !!!"}/>}
  </>
}

export default App
