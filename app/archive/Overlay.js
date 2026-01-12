import React, { useRef, useState, useEffect, useContext } from 'react';
import gsap from 'gsap';
import Toolbar from './Toolbar';
import InnerFooter from './InnerFooter';
import { OverlaysContext } from "../contexts/OverlaysContext"
import { freezeBackground, unfreezeBackground } from '../components/freezeBackground';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import resizeListener from '../components/resizeListener'

export default function Overlay ({
    id,
    toolbarDownload,
    anchors,
    anchorsTitle,
    children,
    noAnchor = false
}) {
    const {overlays, storeOverlays, resetOverlays, closeEvent, storeCloseEvent, openEvent, storeOpenEvent } = useContext(OverlaysContext)
    const [thisOverlay, setThisOverlay] = useState()
    const [scrollStop, setScrollStop] = useState(false)
    const overlay = useRef()
    const topRef = useRef()

    gsap.registerPlugin(ScrollToPlugin)

    useEffect(() => {

        const foundOverlay = overlays.find(overlay => overlay.ref === id)
        setThisOverlay(foundOverlay)
        if(foundOverlay && foundOverlay.show) {
          openOverlay(foundOverlay.ref, foundOverlay.i && foundOverlay.i)
        }
      }, [overlays]);

    useEffect(() => {
        if (thisOverlay) {
            if (topRef.current.style.paddingTop !== thisOverlay.anchorY) {
                gsap.to(topRef.current, {
                    paddingTop: openEvent ? 
                                            !noAnchor && (thisOverlay.anchorY > window.scrollY+window.innerHeight || thisOverlay.anchorY < window.scrollY) ? window.scrollY : thisOverlay.anchorY 
                                            : thisOverlay.anchorY,
                    // paddingTop: thisOverlay.anchorY,
                    duration: 1,
                    ease: "power2.out",
                })
            }
        }
    }, [thisOverlay, openEvent])

    useEffect(() => {
        const scrollStopper = () => {
            if (window.scrollY < localStorage.getItem(`backPageScrollPos`)) {
              window.scrollTo({top: localStorage.getItem(`backPageScrollPos`)})
            }
        }
        if (scrollStop) {
            scrollStopper()
            window.addEventListener('scroll', scrollStopper)
        } else {
            window.removeEventListener('scroll', scrollStopper)
        }
        return () => {
            window.removeEventListener('scroll', scrollStopper)
        }
    }, [scrollStop])

    function scrollTo (y) {
        gsap.to(window, {
            scrollTo: y,
            duration: 1.2,
            ease: "power1.inOut"
        })
    }

    const openOverlay = (id, i) => {
        freezeBackground();
        overlay.current.style.display = 'block';
        setScrollStop(true);
        document.querySelector('.page').classList.add('overlay-body-margin-compensator')  
    
        gsap.to(`#${id}`, {
            opacity: 1,
            // y: 0,
            onComplete: () => {
                (i > -1) ? 
                    !noAnchor ? 
                            (i > 0) && scrollTo(document.querySelector(`[data-index="${i}"]`).offsetTop - 17) 
                            : scrollTo(document.querySelector(`[data-index="${i}"]`).offsetTop - 17) 
                : ''
            }
        })
    }

    const closeOverlay = () => {
        gsap.to(document.querySelector(`#${id}`), {
            opacity: 0,
            // y: 6,
            onComplete: () => {
                overlay.current.style.display = 'none'
                unfreezeBackground()
                setScrollStop(false)
                storeOverlays(prev => prev.map(overlay => {
                    if (overlay.ref === id) {
                        return {
                            ...overlay,
                            show: false,
                        }
                    }
                    return overlay
                }))
                storeCloseEvent(true)
                storeOpenEvent(false)
                document.querySelector('.page').classList.remove('overlay-body-margin-compensator')  
            }
        })
    }

    return (
    // <div className='overlay' id={id} ref={overlay} style={{ display: 'none', opacity: '0', transform: 'translateY(6px)' }}>
    <div className='overlay' id={id} ref={overlay} style={{ display: 'none', opacity: '0' }}>
        {/* <div className="transparent-block-top" style={ thisOverlay && { paddingTop: `${thisOverlay.anchorY}px` }} onClick={closeOverlay}></div> */}
        <div className="transparent-block-top" ref={topRef} onClick={closeOverlay}></div>
        <div className='overlay-content'>
            <Toolbar anchors={anchors} anchorsTitle={anchorsTitle} download={toolbarDownload} closeFunc={closeOverlay}/>
            {children}
            <InnerFooter closeFunc={closeOverlay}/>
        </div>
        <div className="transparent-block-bottom" onClick={closeOverlay}></div>
    </div>
    )
}
