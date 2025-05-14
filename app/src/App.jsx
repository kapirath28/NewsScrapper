import { useEffect, useState, useRef } from 'react'
import './App.css';
import {io} from 'socket.io-client'
import {v4 as uuid} from 'uuid';
import Button from './Components/Button';

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


  const scrollRef = useRef();
  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300; // Adjust scroll distance

    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  return <>
    <nav className="navbar navbar-expand-lg bg-body-tertiary mb-4">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">News !!!</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" aria-disabled="true">Disabled</a>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>

  {
    loading ? <div style={{background : "transparent"}}><img src = {"Loading.svg"}/></div> : null
  }

    <div style={{ position: "relative" }}>
      {/* Scroll Buttons */}
      <Button direction={"left"} scroll={scroll}/>

      <Button direction={"right"} scroll={scroll}/>
      

      {/* Scrollable News Container */}
      <div
        className="news-scroll d-flex gap-3"
        ref={scrollRef}
      >
        {news.map((n, index) => (
          <div
            key={index}
            className="card"
            style={{ width: "20%", minWidth: "200px", flexShrink: 0 }}
          >
            {n.image_url && (
              <img src={n.image_url} className="card-img-top" alt="news" />
            )}
            <div className="card-body">
              <p className="card-text">{n.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

  </>
}

export default App
