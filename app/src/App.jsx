import { useEffect, useState } from 'react'
import './App.css';

function App() {
  const [news, setNews] = useState([]);
  async function getNews(){
    const data = await fetch ("https://newsdata.io/api/1/news?apikey=pub_868799d5500086b9924fcd09afbf524737933&country=in&language=en&category=politics", {
      method : "GET",
    })
    const res = await data.json();
    setNews(res.results);
    
  }

  useEffect(()=> {
    getNews();
    console.log(news); 
  }, [])

  return <>
  <div>News !!!</div>
  <div style={{display : 'flex', gap : "20px"}}>
  {
    news.map(n => {
      return <div>
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
