import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import LocomotiveScroll from 'locomotive-scroll';
import imagesLoaded from 'imagesloaded';


export const useGalleryAnimations = (scrollRef, galleryRef) => {
  useGSAP(() => {
    
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
      reloadOnContextChange: false
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