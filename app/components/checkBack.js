import React, { useEffect, useRef, useContext } from 'react';
import { freezeBackground, unfreezeBackground } from '../components/freezeBackground';
import { useRouter } from 'next/router';
import gsap from 'gsap';
import { OverlaysContext } from "../contexts/OverlaysContext"

const checkBack = () => {
    const lastModalParamRef = useRef()
    const router = useRouter()
    const {overlays, storeOverlays, resetOverlays, closeEvent, storeCloseEvent, openEvent, storeOpenEvent } = useContext(OverlaysContext)

    const closeOverlay = (id) => {
        gsap.to(document.querySelector(`#${id}`), {
            opacity: 0,
            duration: 1,
            // y: 6,
            onComplete: () => {
                document.querySelector(`#${id}`).style.display = 'none'
                unfreezeBackground()
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
    
    useEffect(() => {
        const currentModalParam = router.query.modal;
      
        if (lastModalParamRef.current && !currentModalParam) {
          !closeEvent && closeOverlay(lastModalParamRef.current);
          lastModalParamRef.current = null; 
        }
      
        if (currentModalParam) {
          lastModalParamRef.current = currentModalParam;
        }
      }, [router.query])
}

export default checkBack


  
