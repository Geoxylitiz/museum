import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import LocomotiveScroll from 'locomotive-scroll';
import imagesLoaded from 'imagesloaded';


export const useGalleryAnimations = (scrollRef, galleryRef) => {
  useGSAP(() => {
    // Wait for images to load before initializing scroll
    const preloadImages = () => {
      return new Promise((resolve) => {
        if (!galleryRef.current) resolve();
        
        imagesLoaded(galleryRef.current, { background: true }, function() {
          resolve();
        });
      });
    };
    
    // Initialize locomotive scroll with performance optimizations
    const initScroll = () => {
      const locoScroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        multiplier: 0.8,
        class: 'is-revealed',
        smartphone: {
          smooth: true,
          inertia: 0.3, // Lower value for better mobile performance
        },
        tablet: {
          smooth: true,
          inertia: 0.5,
        },
        reloadOnContextChange: false,
        lerp: 0.1, // Lower value for smoother performance
        getDirection: true,
        getSpeed: true,
      });

      // Update scroll on image load to prevent layout shifts
      document.addEventListener('lazyloaded', () => locoScroll.update());
      
      // Handle resize more efficiently with debounce
      let resizeTimer;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          locoScroll.update();
        }, 250);
      };

      window.addEventListener('resize', handleResize);
      
      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        if (locoScroll) {
          locoScroll.destroy();
        }
      };
    };

    // Execute sequence
    preloadImages().then(initScroll);
  }, [scrollRef, galleryRef]);
}; 