import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import LocomotiveScroll from 'locomotive-scroll';
import imagesLoaded from 'imagesloaded';


export const useGalleryAnimations = (scrollRef, galleryRef) => {
  useGSAP(() => {
    // Make sure items are visible initially, then animate them
    gsap.set('.artwork-item', { opacity: 1, y: 0 });
    
    // Initialize locomotive scroll
    const locoScroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 0.8,
      class: 'is-revealed',
      smartphone: {
        smooth: true
      },
      tablet: {
        smooth: true
      },
      reloadOnContextChange: true
    });

  

    // Wait for images to load before initializing animations
    const imgLoad = imagesLoaded(galleryRef.current);
    
    imgLoad.on('always', () => {
      // Refresh locomotive scroll
      locoScroll.update();

      // Create scroll-triggered animations for each artwork item
    });

    // Handle resize
    const handleResize = () => {
      locoScroll.update();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      if (locoScroll) {
        locoScroll.destroy();
      }
    };
  }, [scrollRef, galleryRef]);
}; 