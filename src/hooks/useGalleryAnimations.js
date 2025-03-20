import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';
import imagesLoaded from 'imagesloaded';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

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

    // Update ScrollTrigger when locomotive scroll updates
    locoScroll.on('scroll', ScrollTrigger.update);

    // Setup ScrollTrigger to work with locomotive-scroll
    ScrollTrigger.scrollerProxy(scrollRef.current, {
      scrollTop(value) {
        return arguments.length 
          ? locoScroll.scrollTo(value, 0, 0) 
          : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0, 
          left: 0, 
          width: window.innerWidth, 
          height: window.innerHeight
        };
      }
    });

    // Wait for images to load before initializing animations
    const imgLoad = imagesLoaded(galleryRef.current);
    
    imgLoad.on('always', () => {
      // Refresh locomotive scroll
      locoScroll.update();

      // Create scroll-triggered animations for each artwork item
      const artworkItems = document.querySelectorAll('.artwork-item');
      
      artworkItems.forEach((item, index) => {
        // Create a scroll-triggered animation
        gsap.fromTo(item, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8,
            ease: 'power3.out',
            
            delay: index * 0.05
          }
        );
      });
    });

    // Handle resize
    const handleResize = () => {
      locoScroll.update();
      ScrollTrigger.update();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      if (locoScroll) {
        locoScroll.destroy();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollRef, galleryRef]);
}; 