// src/pages/About.jsx
import './about.css';

const About = () => {
  return (
    <div className="about">
      <h1>About ShopVerse</h1>
      <div className="about-content">
        <p>
          ShopVerse is a modern e-commerce platform built with React and Vite. 
          We're dedicated to providing the best online shopping experience with 
          a focus on quality, convenience, and customer satisfaction.
        </p>
        <div className="about-features">
          <div className="about-feature">
            <h3>Our Mission</h3>
            <p>To make online shopping accessible, enjoyable, and secure for everyone.</p>
          </div>
          <div className="about-feature">
            <h3>Our Vision</h3>
            <p>To become the leading e-commerce platform known for innovation and excellence.</p>
          </div>
          <div className="about-feature">
            <h3>Our Values</h3>
            <p>Quality, integrity, and customer-centric approach in everything we do.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
