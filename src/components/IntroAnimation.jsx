import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './IntroAnimation.css';

const IntroAnimation = ({ onAnimationComplete }) => {
  // Ensure scrolling is disabled during animation
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Text animation
  const titleText = "TEAM-O7";
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
        delay: 0.5 + i * 0.08,
      }
    })
  };

  return (
    <motion.div
      className="intro-container"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.2, delay: 4.5, ease: [0.65, 0, 0.35, 1] }}
      onAnimationComplete={onAnimationComplete}
    >
      {/* Background frame */}
      <motion.div 
        className="frame"
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
      />
      
      {/* Main content */}
      <div className="content-wrapper">
        {/* Animated line */}
        <motion.div 
          className="line"
          initial={{ width: 0 }}
          animate={{ width: '40%' }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
        />
        
        {/* Title with letter animation */}
        <div className="title-container">
          {titleText.split('').map((letter, index) => (
            <motion.span
              key={index}
              className="title-letter"
              custom={index}
              initial="hidden"
              animate="visible"
              variants={letterVariants}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        
        {/* Subtitle with fade-in */}
        <motion.p 
          className="subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: "easeOut" }}
        >
          Immersive Art Experience
        </motion.p>
        
        {/* Decorative elements */}
        <div className="decorative-elements">
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={i}
              className="element"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ 
                duration: 0.6, 
                delay: 2.2 + (i * 0.15),
                ease: [0.34, 1.56, 0.64, 1] 
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Bottom loader */}
      <motion.div 
        className="loader"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 3.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
};

export default IntroAnimation;