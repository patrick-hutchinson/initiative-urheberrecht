import React, { useRef, useState, useEffect, useContext, use } from 'react';
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
    const [scrollToEvent, setScrollToEvent] = useState(false)

    gsap.registerPlugin(ScrollToPlugin)


    useEffect(() => {

        const foundOverlay = overlays.find(overlay => overlay.ref === id)
        setThisOverlay(foundOverlay)
        if(foundOverlay && foundOverlay.show) {
          openOverlay(foundOverlay.ref, foundOverlay.i && foundOverlay.i)
        }
      }, [overlays]);

    useEffect(() => {
        if (thisOverlay && thisOverlay.show && openEvent) {
                gsap.to(topRef.current, {
                    paddingTop: window.scrollY,
                    duration: 1,
                    ease: "power2.out",
                })
        }
    }, [thisOverlay, openEvent])

    const scrollToF = () => {
        const distance = Math.abs(localStorage.getItem(`backPageScrollPos`) - window.scrollY);
        const baseDuration = 3; 
        const adjustedDuration = baseDuration / (1 + distance * 0.005);

        gsap.to(window, {
            scrollTo: localStorage.getItem(`backPageScrollPos`),
            duration: adjustedDuration,
            ease: "power4.inOut",
            onComplete: () => setScrollToEvent(false)
        })
        // window.scrollTo({top: localStorage.getItem(`backPageScrollPos`), behavior: 'smooth'})
        // setScrollToEvent(false)
    }

    useEffect(() => {
        scrollToEvent && scrollToF()
    }, [scrollToEvent])

    useEffect(() => {
        const scrollStopper = () => {
            if (window.scrollY < localStorage.getItem(`backPageScrollPos`)) {
                setScrollToEvent(true)
            }
        }

        if (scrollStop) {
            scrollStopper()
            window.addEventListener('scrollend', scrollStopper)
        } else {
            window.removeEventListener('scrollend', scrollStopper)
        }
        return () => {
            window.removeEventListener('scrollend', scrollStopper)
        }
        
    }, [scrollStop])

    function scrollTo (y) {
        gsap.to(window, {
            scrollTo: y,
            duration: 1,
            ease: "power1.inOut",
        })
    }

    const openOverlay = (id, i) => {
        topRef.current.style.paddingTop = `${window.scrollY + 100}px`
        freezeBackground()
        overlay.current.style.display = 'block'
        document.querySelector('.page').classList.add('overlay-body-margin-compensator')  
    
        gsap.to(`#${id}`, {
            opacity: 1,
            onComplete: () => {
                setScrollStop(true)
                if (i > -1) {
                    if (!noAnchor && i > 0) {
                        scrollTo(document.querySelector(`[data-index="${i}"]`).offsetTop - 34);
                    } else {
                        scrollTo(document.querySelector(`[data-index="${i}"]`).offsetTop - 34);
                    }
                }
            }
        })
    }

    const closeOverlay = () => {
        gsap.to(document.querySelector(`#${id}`), {
            opacity: 0,
            duration: 1.2,
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
        <div className='overlay' id={id} ref={overlay} style={{ display: 'none', opacity: '0' }}>
            <div className="transparent-block-top" ref={topRef} onClick={closeOverlay}></div>
            <div className='overlay-content'>
                <Toolbar anchors={anchors} anchorsTitle={anchorsTitle} download={toolbarDownload} closeFunc={closeOverlay}/>
                {children}
                <InnerFooter download={toolbarDownload} closeFunc={closeOverlay}/>
            </div>
            <div className="transparent-block-bottom" onClick={closeOverlay}></div>
        </div>
    )
}
