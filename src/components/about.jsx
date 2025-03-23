import React, { useEffect, useRef } from 'react';
import './about.css';
import { useLocomotive } from '../hooks/useLocomotive';

const About = () => {
 
  const scrollRef = useRef(null);
  
  useLocomotive(scrollRef);

  return (
    <div className="scroll-container" ref={scrollRef} data-scroll-container>
      <div className="about-container" data-scroll-section>
        {/* Hero Section */}
        <div className="about-hero">
          <h1 data-scroll data-scroll-speed="1" className="about-title">About Us</h1>
          <p data-scroll data-scroll-speed="0.5" className="about-subtitle">
            Celebrating art through digital innovation
          </p>
        </div>
        
        {/* About Section */}
        <section className="about-section">
          <h2 className="about-heading">Our Story</h2>
          <div className="about-content">
            <p>
              Team 0-7 was founded in 2025 with a vision to revolutionize how people experience and interact with art in the digital age. 
              We believe art should be accessible to everyone, transcending physical boundaries through technology.
            </p>
            <p>
              Our gallery showcases diverse artworks from emerging and established artists worldwide, 
              creating a platform where traditional art forms meet cutting-edge digital experiences.
            </p>
          </div>
          
          <div className="about-image" data-scroll data-scroll-speed="0.3">
            <div className="image-placeholder">
              <img src={'/team/bernard.png'} alt="About Us" />
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="values-section">
          <h2 className="about-heading">Our Values</h2>
          <div className="values-grid">
            <div className="values-item">
              <h3>Innovation</h3>
              <p>Pushing boundaries of digital art presentation and interaction</p>
            </div>
            <div className="values-item">
              <h3>Accessibility</h3>
              <p>Making art experiences available to diverse audiences</p>
            </div>
            <div className="values-item">
              <h3>Authenticity</h3>
              <p>Preserving artistic integrity in the digital landscape</p>
            </div>
            <div className="values-item">
              <h3>Community</h3>
              <p>Fostering connections between artists and art enthusiasts</p>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="team-section">
          <h2 className="about-heading">Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src={'/team/bernard.png'} alt="Bernard VECTOR King" />
              </div>
              <h3>Bernard VECTOR King</h3>
              <p>Founder & Creative Director</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src={'/team/justine.png'} alt="Justine Llamera" />
              </div>
              <h3>Justine Llamera</h3>
              <p>Technology Lead</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src={'/team/jc.png'} alt="Jc D. Laput" />
              </div>
              <h3>Jc D. Laput</h3>
              <p>Curator</p>
            </div>
          </div>
        </section>
        
        
      </div>
    </div>
  );
};

export default About;



