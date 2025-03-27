import { useGSAP } from '@gsap/react';
import LocomotiveScroll from 'locomotive-scroll';
import { useState, useEffect } from 'react';
import gsap from 'gsap';

export const useGalleryAnimations = (scrollRef) => {
    const [locoInstance, setLocoInstance] = useState(null);
    
    // Initialize and configure horizontal locomotive scroll
    useGSAP(() => {
        if (!scrollRef.current) return;

        // Helper function to update locomotive scroll
        const updateScroll = () => {
            if (locoInstance) {
                locoInstance.update();
            }
        };

        // Initialize locomotive scroll with horizontal direction
        const locoScroll = new LocomotiveScroll({
            el: scrollRef.current,
            smooth: true,
            direction: 'horizontal', // Set direction to horizontal for side scrolling
            multiplier: 1,
            lerp: 0.05,
            class: 'is-revealed',
            getDirection: true,
            getSpeed: true,
            inertia: 0.5,
            smartphone: {
                smooth: true,
                direction: 'horizontal',
                gestureDirection: 'both'
            },
            tablet: {
                smooth: true,
                direction: 'horizontal',
                gestureDirection: 'both'
            },
            reloadOnContextChange: true
        });

        // Save the instance to state
        setLocoInstance(locoScroll);
    
        // Handle resize
        const handleResize = () => {
            updateScroll();
        };
    
        window.addEventListener('resize', handleResize);
        
        // Delayed update for when images load
        setTimeout(() => {
            updateScroll();
        }, 1000);
    
        // Cleanup function
        return () => {
            if (locoScroll) {
                locoScroll.destroy();
            }
            setLocoInstance(null);
            window.removeEventListener('resize', handleResize);
        };
    }, [scrollRef]);

    // Gallery item hover effects
    const initGalleryItemAnimations = () => {
        // Add hover effects to gallery items
        const galleryItems = document.querySelectorAll('.artwork-item');
        
        galleryItems.forEach((item) => {
            const image = item.querySelector('img');
            const overlay = item.querySelector('.artwork-overlay');
            
            item.addEventListener('mouseenter', () => {
                gsap.to(image, {
                    scale: 1.1,
                    duration: 0.4,
                    ease: "power2.out"
                });
                
                gsap.to(overlay, {
                    opacity: 1,
                    duration: 0.3
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(image, {
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out"
                });
                
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.3
                });
            });
        });
    };

    return {
        locoInstance,
        initGalleryItemAnimations
    };
};
