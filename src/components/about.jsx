import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './about.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const scrollRef = useRef(null);
  const teamRef = useRef(null);
  
  useEffect(() => {
    // Animation for section headings
    gsap.from('.about-heading', {
      y: 50,
      opacity: 100,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 70%',
      }
    });
    
    // Animation for about content
    gsap.from('.about-content', {
      y: 30,
      opacity: 100,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-content',
        start: 'top 80%',
      }
    });
    
    // Animation for team members
    gsap.from('.team-member', {
      y: 40,
      opacity: 100,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: teamRef.current,
        start: 'top 75%',
      }
    });
    
    // Animation for values items
    gsap.from('.values-item', {
      y: 30,
      opacity: 100,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.values-grid',
        start: 'top 80%',
      }
    });
  }, []);
  
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
            <div className="image-placeholder"></div>
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
        <section className="team-section" ref={teamRef}>
          <h2 className="about-heading">Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image"></div>
              <h3>Bernard VECTOR King</h3>
              <p>Founder & Creative Director</p>
            </div>
            <div className="team-member">
              <div className="member-image"></div>
              <h3>Justine Llamera</h3>
              <p>Technology Lead</p>
            </div>
            <div className="team-member">
              <div className="member-image"></div>
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



