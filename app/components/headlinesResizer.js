import { useEffect, useContext } from 'react';
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { OverlaysContext } from "../contexts/OverlaysContext";

export default function headlinesResizer() {
    const {openEvent} = useContext(OverlaysContext)

    const h1Triggers = []

    useEffect(() => {
        if (!openEvent) {
            const h1s = document.querySelectorAll("h1.scalable");
            const h1Firsts = document.querySelectorAll("h1.scalable-first");

            h1Firsts.forEach(h1First => {
                let height
                setTimeout(() => {
                    height = h1First.getBoundingClientRect().height
                }, 100)

                gsap.registerPlugin(ScrollTrigger)

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: h1First,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                        onUpdate: self => {
                            const scaleValue = 1 - 0.5 * self.progress
                            h1First.style.transform = `scale(${scaleValue})`
                            h1First.style.transformOrigin = `0 0`
                            h1First.style.height = `${height * (scaleValue)}px`
                        }
                    },
                })
            
                // triggers.push(tl.scrollTrigger);
            });

            h1s.forEach((h1, index) => {
                let height
                setTimeout(() => {
                    height = h1.getBoundingClientRect().height
                }, 100)

                gsap.registerPlugin(ScrollTrigger)

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: h1,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                        onUpdate: self => {
                            const scaleValue = 1 - 0.5 * self.progress
                            h1.style.transform = `scale(${scaleValue})`
                            h1.style.transformOrigin = `0 0`
                            h1.style.height = `${height * (scaleValue)}px`

                            if (index < h1s.length - 1 && h1Triggers[index + 1]) {
                                h1Triggers[index + 1].refresh()
                            }
                        },
                    },
                })
                h1Triggers.push(tl.scrollTrigger);
            })

        } else {
            h1Triggers.forEach(trigger => trigger.pause());
        }

        return () => {
            h1Triggers.forEach(trigger => trigger.kill());
        };
    }, [openEvent]);

    return null
}
