import { useRef } from "react";
import Button from "./Button"
import Newscard from "./Newscard";

export default function NewsContainer({news, Genre}){
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

    const handleReadMore = (url) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    return <div style={{ position: "relative" }}>
      <div>{Genre}</div>
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
              <img 
                src={n.image_url} 
                className="card-img-top" 
                alt="news"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x300/333333/FFFFFF/png?text=No+Image';
                }}
              />
            )}
            <div className="card-body">
              <p className="card-text">{n.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
}