export default function Newscard({news}){
    const truncateTitle = (title) => {
        const words = title.split(' ');
        if (words.length > 20) {
            return words.slice(0, 20).join(' ') + '...';
        }
        return title;
    };
    const handleReadMore = (url) => {
      window.open(url, '_blank', 'noopener,noreferrer');
  };
    return <>
    {news.map((n, index) => (
          <div
            key={index}
            className="card d-flex flex-column"
            style={{ 
              width: "25%", 
              minWidth: "200px", 
              height: "400px", 
              flexShrink: 0,
              margin: "10px"
            }}
          >
            {n.image_url && (
              <img 
                src={n.image_url} 
                className="card-img-top" 
                alt="news"
                style={{ height: "200px", objectFit: "cover" }}
              />
            )}
            <div className="card-body d-flex flex-column" style={{ flex: "1 1 auto" }}>
              <p className="card-text">{truncateTitle(n.title)}</p>
            </div>
            <div className="card-footer bg-transparent border-0">
              <button 
                className="btn btn-success w-100"
                onClick={() => handleReadMore(n.link)}
              >
                Read More
              </button>
            </div>
          </div>
        ))}
    </>
}