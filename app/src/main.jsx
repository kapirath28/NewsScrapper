import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './components/Navbar.jsx'

function Main() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <StrictMode>
      <Navbar onSearch={handleSearch} />
      <App searchTerm={searchTerm} />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Main />)
