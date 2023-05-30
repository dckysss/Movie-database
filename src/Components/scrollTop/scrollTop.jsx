import React, { useState, useEffect } from 'react';
import './scrollTop.css';

const ScrollTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        setIsVisible(scrollTop > 666);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };
  
    return (
      <div className={`back-to-top-button ${isVisible ? 'visible' : ''}`} onClick={scrollToTop}>
        SCROLL TOP
      </div>
    );
  };

  export default ScrollTopButton;