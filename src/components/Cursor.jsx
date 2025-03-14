import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Cursor.css';

const Cursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;
    
    const mouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const animation = gsap.to({}, 0.016, {
      repeat: -1,
      onRepeat: () => {
        posX += (mouseX - posX) / 9;
        posY += (mouseY - posY) / 9;
        
        gsap.set(follower, {
          left: posX,
          top: posY,
          x: '-50%',
          y: '-50%'
        });
        
        gsap.set(cursor, {
          left: mouseX,
          top: mouseY,
          x: '-50%',
          y: '-50%'
        });
      }
    });
    
    document.addEventListener('mousemove', mouseMove);
    
    // Add hover effect for links and buttons
    const handleLinkMouseEnter = () => {
      cursor.classList.add('active');
      follower.classList.add('active');
    };
    
    const handleLinkMouseLeave = () => {
      cursor.classList.remove('active');
      follower.classList.remove('active');
    };
    
    const links = document.querySelectorAll('a, button, .artwork-item');
    links.forEach(link => {
      link.addEventListener('mouseenter', handleLinkMouseEnter);
      link.addEventListener('mouseleave', handleLinkMouseLeave);
    });
    
    // Hide cursor when it leaves the window
    const handleWindowMouseLeave = () => {
      cursor.style.opacity = 0;
      follower.style.opacity = 0;
    };
    
    const handleWindowMouseEnter = () => {
      cursor.style.opacity = 1;
      follower.style.opacity = 1;
    };
    
    document.body.addEventListener('mouseleave', handleWindowMouseLeave);
    document.body.addEventListener('mouseenter', handleWindowMouseEnter);
    
    return () => {
      document.removeEventListener('mousemove', mouseMove);
      document.body.removeEventListener('mouseleave', handleWindowMouseLeave);
      document.body.removeEventListener('mouseenter', handleWindowMouseEnter);
      
      if (animation) {
        animation.kill();
      }
      
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleLinkMouseEnter);
        link.removeEventListener('mouseleave', handleLinkMouseLeave);
      });
    };
  }, []);
  
  return (
    <>
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-follower" ref={followerRef}></div>
    </>
  );
};

export default Cursor; 