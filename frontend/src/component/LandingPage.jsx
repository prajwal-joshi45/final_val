import React from 'react';
import '../template/LandingPage.css';
import image from '../assets/image.png';
import { useNavigate } from 'react-router-dom';
import "../App.jsx"

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="app">
     
      <nav className="navbar">
        <div className="logo">FormBot</div>
        <div className="nav-links">
          <button className="sign-in">Sign in</button>
          <button className="create">Create a FormBot</button>
        </div>
      </nav>

      <div className="container">
      <header className="hero">
        <h1>Build advanced chatbots visually</h1>
        <p>
          Typebot gives you powerful blocks to create unique chat experiences. Embed them anywhere
          on your web/mobile apps and start collecting results like magic.
        </p>
        <button className="cta" onClick={() => navigate('/login')}>Create a FormBot for free</button>
      </header>

      
      <div className="image-section">
        <img src= {image} alt="Chatbot editor interface" className="main-image" />
      </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4>FormBot</h4>
            <p>Made with ❤️ by @cuvette</p>
          </div>
          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li><a href="#">Status</a></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Roadmap</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Community</h4>
            <ul>
              <li><a href="#">Discord</a></li>
              <li><a href="#">GitHub Repository</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">OSS Friends</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;