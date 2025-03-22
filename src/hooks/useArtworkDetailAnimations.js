import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';

gsap.registerPlugin(ScrollTrigger);

const useArtworkDetailAnimations = (artwork, isLoading, refs) => {
  const { imageContainerRef, descriptionRef, relatedRef, scrollRef, contentRef, loadingOverlayRef, loadingProgressRef } = refs;

  useGSAP(() => {
    if (!artwork || isLoading) return;

    // Initialize locomotive scroll after loading
    scrollRef.current = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]'),
      smooth: true,
      multiplier: 0.8,
      smartphone: {
        smooth: true
      },
      tablet: {
        smooth: true
      }
    });

    // Update locomotive scroll
    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
      scrollTop(value) {
        return arguments.length 
          ? scrollRef.current.scrollTo(value, 0, 0) 
          : scrollRef.current.scroll.instance.scroll.y;
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

    // Set up scroll-based animations
    const sections = [
      { ref: imageContainerRef, delay: 0 },
      { ref: descriptionRef, delay: 0.2 },
      { ref: relatedRef, delay: 0.2 }
    ];

    sections.forEach(({ ref, delay }) => {
      if (!ref.current) return;

      ScrollTrigger.create({
        trigger: ref.current,
        scroller: '[data-scroll-container]',
        start: 'top bottom-=100',
        onEnter: () => {
          gsap.fromTo(ref.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, delay, ease: 'power3.out' }
          );
        },
        once: true
      });
    });

    // Clean up
    return () => {
      if (scrollRef.current) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        scrollRef.current.destroy();
      }
    };
  }, [artwork, isLoading]);

  useGSAP(() => {
    if (!artwork) return;

    // Initially hide the main content
    if (contentRef.current) {
      gsap.set(contentRef.current, { 
        opacity: 0,
        visibility: 'hidden'
      });
    }

    const loadingTimeline = gsap.timeline({
      onComplete: () => {
        if (contentRef.current) {
          gsap.to(contentRef.current, {
            opacity: 1,
            visibility: 'visible',
            duration: 0.5
          });
        }
      }
    });

    loadingTimeline
      .to(loadingOverlayRef.current, {
        duration: 0.5,
        opacity: 1,
        visibility: 'visible'
      })
      .to(loadingProgressRef.current, {
        width: '100%',
        duration: 1.5,
        ease: 'power2.inOut'
      })
      .to(loadingOverlayRef.current, {
        opacity: 0,
        duration: 0.5,
        pointerEvents: 'none',
        visibility: 'hidden'
      });

  }, [artwork]);
};

export default useArtworkDetailAnimations;
