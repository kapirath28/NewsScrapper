import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import '@fontsource/inter/400.css';
import '@fontsource/poppins/700.css';
import App from './App.jsx'
import Navbar from './components/Navbar.jsx'

createRoot(document.getElementById('root')).render(
<<<<<<< HEAD
  <BrowserRouter>
    <App />
  </BrowserRouter>
=======
  <StrictMode>
    <Navbar/>
    <App />
  </StrictMode>
>>>>>>> 4f6186de376bb82c4d3dc40c0137d77f0ab45a7f
)
