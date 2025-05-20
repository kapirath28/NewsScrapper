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
        <Newscard news={news}/>
      </div>
    </div>
}