export default function Navbar({ onSearch }){
    const handleSearch = (e) => {
        e.preventDefault();
        const searchTerm = e.target.search.value.toLowerCase();
        onSearch(searchTerm);
    };

    return <>
    <header style={{margin : "0 0 4em 0"}}>
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top mb-3">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">News !!!</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">All</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Link</a>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Categories
                  </a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#" onClick={() => onSearch("politics")}>Politics</a></li>
                    <li><a className="dropdown-item" href="#" onClick={() => onSearch("technology")}>Technology</a></li>
                    <li><a className="dropdown-item" href="#" onClick={() => onSearch("entertainment")}>Entertainment</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#" onClick={() => onSearch("")}>Show All</a></li>
                  </ul>
                </li>
              </ul>
              <form className="d-flex" role="search" onSubmit={handleSearch}>
                <input 
                  className="form-control me-2" 
                  type="search" 
                  name="search"
                  placeholder="Enter category (politics, technology, entertainment)" 
                  aria-label="Search" 
                />
                <button className="btn btn-outline-success" type="submit">Search</button>
              </form>
            </div>
          </div>
        </nav>
    </header>  
    </>
}