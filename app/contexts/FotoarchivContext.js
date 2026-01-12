import React, {createContext, useState, useEffect } from 'react';
import { gsap } from 'gsap';

export const FotoarchivContext = createContext();

const UserContextProvider = (props) => {
    const [fotoarchivState, setFotoarchivState] = useState({
        mode: 'grid',
        part: 'konferenz',
        id: 0,
        folder: 0,
        slide: 0
    })

    const storeFotoarchivState = fotoarchivState => {
        setFotoarchivState(fotoarchivState)
    }

    const toggleHeight = (mode) => {
        const overlayContent = document.querySelector('.overlay-content');
        const overlayFooter = document.querySelector('.overlay-footer');
        const overlayModal = document.querySelector('.ReactModal__Content');
        const overlay = document.querySelector('.overlay');

        if (!overlayContent || !overlayFooter || !overlayModal || !overlay) return;
    
        const currentOverlayHeight = overlayContent.getBoundingClientRect().height;
    
        if (mode === 'slides') {
          overlayFooter.style.visibility = 'hidden';
          overlayModal.style.overflow = 'hidden';
          overlay.style.transition = 'top 0.2s linear';
          overlay.style.top = `${overlayModal.scrollTop}px`;
    
          gsap.fromTo(overlayContent, {
            height: currentOverlayHeight,
          }, {
            height: window.innerHeight,
            duration: 0.3,
            ease: 'linear',
            onComplete: () => {
                overlayContent.style.height = '100svh';
            }
          });
        } else {
          overlayFooter.style.visibility = 'visible';
          overlayModal.style.overflow = 'auto';
          overlay.style.top = '0';

          overlayContent.style.height = window.innerHeight;
    
          gsap.to(overlayContent, {
            height: 'auto',
            duration: 0.3,
            ease: 'linear',
            onComplete: () => {
              overlay.style.transition = 'unset';
            }
          });
    
          gsap.to(overlayModal, {
            scrollTop: 0,
            duration: 0.3,
            ease: 'linear',
          });
        }
    }

    return (
        <FotoarchivContext.Provider value={{ fotoarchivState, storeFotoarchivState, toggleHeight }}>
            {props.children}
        </FotoarchivContext.Provider>
    )
}

export default UserContextProvider;