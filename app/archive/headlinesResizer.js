import { useEffect, useContext } from 'react';
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { OverlaysContext } from "../contexts/OverlaysContext";

gsap.registerPlugin(ScrollTrigger);

export default function headlinesResizer() {
    const {openEvent} = useContext(OverlaysContext);

    useEffect(() => {
        const triggers = [];

        if (!openEvent) {
            const h1s = document.querySelectorAll("h1.scalable");
            const h1Firsts = document.querySelectorAll("h1.scalable-first");

            h1Firsts.forEach(h1First => {
                let height
                setTimeout(() => {
                    height = h1First.getBoundingClientRect().height
                }, 100);
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: h1First,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                        once: true,
                        onUpdate: self => {
                            if (self.progress < 0.99) {
                                const scaleValue = 1 - 0.5 * self.progress
                                h1First.style.transform = `scale(${scaleValue})`
                                h1First.style.transformOrigin = `0 0`
                                h1First.style.height = `${height * (scaleValue)}px`
                            } else {
                                h1First.style.transform = `scale(1)`
                                h1First.style.transformOrigin = `0 0`
                                h1First.style.height = `${height}px`
                            }
                        }
                    },
                })
            
                triggers.push(tl.scrollTrigger);
            });

            h1s.forEach(h1 => {
                let height
                setTimeout(() => {
                    height = h1.getBoundingClientRect().height
                }, 100);
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: h1,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                        once: true,
                        onUpdate: self => {
                            if (self.progress < 0.99) {
                                const scaleValue = 1 - 0.5 * self.progress
                                h1.style.transform = `scale(${scaleValue})`
                                h1.style.transformOrigin = `0 0`
                                h1.style.height = `${height * scaleValue}px`
                            } else {
                                h1.style.transform = `scale(1)`
                                h1.style.transformOrigin = `0 0`
                                h1.style.height = `${height}px`
                            }
                        },
                    },
                })
            
                triggers.push(tl.scrollTrigger);
            });

        } else {
            triggers.forEach(trigger => trigger.pause());
        }

        return () => {
            triggers.forEach(trigger => trigger.kill());
        };
    }, [openEvent]);

    return null
}
