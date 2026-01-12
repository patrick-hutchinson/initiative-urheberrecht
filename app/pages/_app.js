import '../styles/fonts.css'
import '../styles/globals.scss'

import OverlayContextProvider from "../contexts/OverlaysContext"
import MenuContextProvider from "../contexts/MenuContext"
import FotoarchivContextProvider from "../contexts/FotoarchivContext"
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import useDynamicDarkMode from '../utils/useDynamicDarkMode'
 
export default function MyApp({ Component, pageProps }) {
  const isDarkMode = useDynamicDarkMode();


  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('darkmode')
      localStorage.setItem('darkmode', 'true')
      document.documentElement.style.setProperty('--color_white', '#000000')
      document.documentElement.style.setProperty('--color_black', '#FFFFFF')
      document.documentElement.style.setProperty('--color_menubackground', 'rgba(0,0,0,0.85)')
      document.documentElement.style.setProperty('--color_overlaybackground', 'rgba(255,255,255,0.95)')
      document.documentElement.style.setProperty('--color_fotoarchiv_mode_changer_default', 'rgba(0,0,0,0)')
      document.documentElement.style.setProperty('--color_fotoarchiv_mode_changer_hover', 'rgba(0,0,0,0.6)')
      document.documentElement.style.setProperty('--color_eventtitletext', 'rgba(0,0,0, 0.65)')
      document.documentElement.style.setProperty('--color_grey', 'rgba(0, 0, 0, 0.5)')
      document.documentElement.style.setProperty('--color_darkgrey', 'rgba(0, 0, 0, 0.3)')
      document.documentElement.style.setProperty('--color_lightgrey', '#5A5A5A')
      document.documentElement.style.setProperty('--color_grey_on_black', 'rgba(255, 255, 255, 0.4)')
      document.documentElement.style.setProperty('--color_grey_on_white', 'rgba(255, 255, 255, 0.1)')
      document.documentElement.style.setProperty('--color_input_back', '#DFDFDF')
      document.documentElement.style.setProperty('--color_input_text', '#FFFFFF')
    } else {
      document.body.classList.remove('darkmode')
      localStorage.setItem('darkmode', 'false')
      document.documentElement.style.setProperty('--color_white', '#FFFFFF')
      document.documentElement.style.setProperty('--color_black', '#000000')
      document.documentElement.style.setProperty('--color_menubackground', 'rgba(255,255,255,0.95)')
      document.documentElement.style.setProperty('--color_overlaybackground', 'rgba(0,0,0,0.9)')
      document.documentElement.style.setProperty('--color_fotoarchiv_mode_changer_default', 'rgba(0,0,0,0)')
      document.documentElement.style.setProperty('--color_fotoarchiv_mode_changer_hover', 'rgba(0,0,0,0.6)')
      document.documentElement.style.setProperty('--color_eventtitletext', 'rgba(255,255,255, 0.75)')
      document.documentElement.style.setProperty('--color_grey', 'rgba(255, 255, 255, 0.4)')
      document.documentElement.style.setProperty('--color_darkgrey', '#4A4A4A')
      document.documentElement.style.setProperty('--color_lightgrey', '#B2B2B2')
      document.documentElement.style.setProperty('--color_grey_on_black', 'rgba(0, 0, 0, 0.4)')
      document.documentElement.style.setProperty('--color_grey_on_white', 'rgba(0, 0, 0, 0.05)')
      document.documentElement.style.setProperty('--color_input_back', '#242424')
      document.documentElement.style.setProperty('--color_input_text', '#4A4A4A')
    }
  }, [isDarkMode])

  return (
    <>
      <MenuContextProvider>
        <OverlayContextProvider>
          <FotoarchivContextProvider>
            <Component {...pageProps} />
          </FotoarchivContextProvider>
        </OverlayContextProvider>
      </MenuContextProvider>
    </>

  )
}