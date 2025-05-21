import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GcashModal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };
  
  const handleOverlayClick = (e) => {
    // Close modal only if the click is directly on the overlay div
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  const modalContentStyle = {
    justifyContent: 'center',
    borderRadius: '10px',
    textAlign: 'center',
    width: '500px', /* Example width */
    height: '500px', /* Example height */
    position: 'relative',
    marginBottom: '10%'
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  const imageStyle = {
    maxWidth: '80%',
    height: 'auto',
    borderRadius: '20px'
  };


  return (
    <div style={modalStyle} onClick={handleOverlayClick}>
      <AnimatePresence>
        {isOpen && ( // AnimatePresence should conditionally render the motion.div
          <motion.div // This motion.div is the element being animated
            style={{ ...modalContentStyle }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <img src="/team/gcash.png" alt="GCash QR Code" style={imageStyle} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default GcashModal;
