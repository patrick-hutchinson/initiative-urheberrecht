import { useEffect, useContext } from 'react';
import gsap from 'gsap';
import showWhenInView from "../components/showWhenInView";

export default function showAfterLoad({ showIn = '', scrollToTop = '', } = {}, callback) {
  
  useEffect(() => {

    const handleLoad = () => {
      if (scrollToTop !== 'true') {
        gsap.to(document.querySelector('.page'), { opacity: 1, duration: 1 });
        gsap.to(document.querySelector('nav'), { opacity: 1, duration: 1 });
        showIn !== 'false' && showWhenInView()
        callback
      } else {
        window.scrollTo(0,0)
        setTimeout(() => {
          gsap.to(document.querySelector('.page'), { opacity: 1, duration: 1 });
          gsap.to(document.querySelector('nav'), { opacity: 1, duration: 1 });
          showIn !== 'false' && 
            setTimeout(showWhenInView(), 100)
          callback
        }, 100)
      }
    };

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []); 
}

