import { useEffect, useContext } from 'react';
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function showWhenInView() {
    gsap.registerPlugin(ScrollTrigger)

    const h1s = [
      ...gsap.utils.toArray('h1'), 
      ...gsap.utils.toArray('.slogan'),
    ]
  
    h1s.forEach((item, i) => {
      const anim = gsap.fromTo(item, {
        autoAlpha: 1,
        scale: 0.96,
        transformOrigin: '0 0'
      }, {
        duration: 0.5,
        autoAlpha: 1,
        scale: 1,
      })

      ScrollTrigger.create({
        trigger: item,
        animation: anim,
        toggleActions: 'play none none none',
        once: true,
      })
    })

    const other = [
      // ...gsap.utils.toArray('.uniblock-title'), 
      ...gsap.utils.toArray('.uniblock-image'), 
      // ...gsap.utils.toArray('.uniblock-text'), 
      // ...gsap.utils.toArray('.block-title'), 
      // ...gsap.utils.toArray('.block-image'), 
      // ...gsap.utils.toArray('.block-text'), 
    ]
  
    other.forEach((item, i) => {
      const anim = gsap.fromTo(item, {
        autoAlpha: 0,
      }, {
        duration: 1,
        autoAlpha: 1,
      })

      ScrollTrigger.create({
        trigger: item,
        animation: anim,
        toggleActions: 'play none none none',
        once: true,
      })
    })
}

