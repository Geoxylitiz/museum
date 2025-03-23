import { useGSAP } from '@gsap/react';
import LocomotiveScroll from 'locomotive-scroll';
import { useState, useEffect } from 'react';

export const useLocomotive = (scrollRef) => {
    const [locoInstance, setLocoInstance] = useState(null);

    useGSAP(() => {
        if (!scrollRef.current) return;

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

        // Save the instance to state
        setLocoInstance(locoScroll);
    
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
          setLocoInstance(null);
        };
      }, [scrollRef]);

    return locoInstance;
};