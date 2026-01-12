import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from 'gsap/dist/all';
import { Draggable } from 'gsap/dist/Draggable';

export default function Poster() {
    const [isLoading, setIsLoading] = useState(true)
    const [isDayTime, setIsDaytime] = useState(true)
    const posRef = useRef()
    const galRef = useRef()
    const carRef = useRef()
    const animRef = useRef()
    let isDragging = false; 

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable);
    
    useEffect(() => {
      // Day & Night
      let hours = new Date().getHours()
      setIsDaytime(hours > 6 && hours < 20) 
      document.body.style.opacity = 0

      // Show content after load
      const handleLoad = () => {
          gsap.to(document.body, { opacity: 1, duration: 1.2 });
      }
      if (document.readyState === 'complete') {
          handleLoad();
      } else {
          window.addEventListener('load', handleLoad);
          return () => window.removeEventListener('load', handleLoad);
      }

      // Hide scrollbar
      document.body.classList.add('delete-scrollbar')
      return () => {
        document.body.classList.remove('delete-scrollbar');
      }
      
    }, [])

    useLayoutEffect(() => {
      // create our context. This function is invoked immediately and all GSAP animations and ScrollTriggers created during the execution of this function get recorded so we can revert() them later (cleanup)
      let ctx = gsap.context(() => {
        gsap.to(carRef.current, { opacity: 1 });
      }, galRef); 
      
      return () => ctx.revert(); // cleanup
    }, [])
  
    useEffect(() => {
      // Scroll on load
      const autoScroll = () => {
        function smoothScrollTo(targetPosition, duration) {
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const startTime = performance.now();
    
            function scrollAnimation(currentTime) {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime < duration) {
                window.scrollTo(window.scrollY, easeInOutQuad(elapsedTime, startPosition, distance, duration));
                requestAnimationFrame(scrollAnimation);
            } else {
                window.scrollTo(window.scrollY, targetPosition);
            }
            }
            requestAnimationFrame(scrollAnimation);
        }
    
        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        setTimeout(() => {
            smoothScrollTo(window.scrollY+1500, 1200)
        }, 100)
      }

      // Loader
      if (document.readyState === "complete") {
        posRef.current.style.visibility = "visible" 
        setIsLoading(false)
        autoScroll()

      } else {
        window.addEventListener('load', function () {
          posRef.current.style.visibility = "visible" 
          setIsLoading(false)
          autoScroll()
        })
      }
      window.addEventListener('orientationchange', () => {
        window.location.reload()
      }, false)

      // window.onbeforeunload = () => {
      //   posRef.current ? posRef.current.style.visibility = "hidden" : ''
      //   carRef.current ? carRef.current.style.opacity = 0 : ''
      //    setTimeout(() => {
      //       window.scrollTo(0,0)
      //    }, 20)
      // }

      // ANIMATION BLOCK
      let iteration = 0; 
      let minSize = window.innerWidth > 568 ? 0.04 : 0.04
      let maxSize = window.innerWidth > 568 ? 3.75 : 3.75
      let minHeight = window.innerWidth > 568 ? 0.1 : 0.1
      let maxHeight = window.innerWidth > 568 ? 15.5 : 15.5
      let spacing = window.innerWidth > 568 ? 0.0273 : 0.0273
  
      // set initial state of items
      gsap.set('.cards li', { scale: `${minSize}`, transformOrigin: '0 0', force3D: false, letterSpacing: '-0.02em' });
        const snapTime = gsap.utils.snap(spacing)
        const cards = gsap.utils.toArray('.cards li')
  
        const animateFunc = element => {
          const tl = gsap.timeline();
          tl.fromTo(element, {scale: `${minSize}`, height: `${minHeight}vh`}, {scale: `${maxSize}`, height: `${maxHeight}vh`, duration: 0.5, yoyo: true, repeat: 1, ease: "power4.in", immediateRender: false})
          return tl;
        }
  
        const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc)
  
        const playhead = {offset: 0}
        
        const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration())
        
        const scrub = gsap.to(playhead, { 
          offset: 0,
          onUpdate() {
            seamlessLoop.time(wrapTime(playhead.offset)); 
          },
          duration: 0.5,
          ease: "power4",
          paused: true
        })
  
        const trigger = ScrollTrigger.create({
          start: 0,
          onUpdate(self) {
            let scroll = self.scroll();
            if (scroll > self.end - 1) {
              wrap(1, 2);
            } else if (scroll < 1 && self.direction < 0) {
              wrap(-1, self.end - 2);
            } else {
              scrub.vars.offset = (iteration + self.progress) * seamlessLoop.duration();
              scrub.invalidate().restart(); // to improve performance, we just invalidate and restart the same tween. No need for overwrites or creating a new tween on each update.
            }
          },
          end: "+=8000",
          pin: ".gallery"
        })
  
        // converts a progress value (0-1, but could go outside those bounds when wrapping) into a "safe" scroll value that's at least 1 away from the start or end because we reserve those for sensing when the user scrolls ALL the way up or down, to wrap.
        const progressToScroll = progress => gsap.utils.clamp(1, trigger.end - 1, gsap.utils.wrap(0, 1, progress) * trigger.end),
        wrap = (iterationDelta, scrollTo) => {
          iteration += iterationDelta;
          trigger.scroll(scrollTo);
          trigger.update(); // by default, when we trigger.scroll(), it waits 1 tick to update().
        }
  
      // when the user stops scrolling, snap to the closest item.
      // ScrollTrigger.addEventListener("scrollEnd", () => scrollToOffset(scrub.vars.offset));
  
      // feed in an offset (like a time on the seamlessLoop timeline, but it can exceed 0 and duration() in either direction; it'll wrap) and it'll set the scroll position accordingly. That'll call the onUpdate() on the trigger if there's a change.
      function scrollToOffset(offset) { // moves the scroll playhead to the place that corresponds to the totalTime value of the seamlessLoop, and wraps if necessary.
        let snappedTime = snapTime(offset),
          progress = (snappedTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration(),
          scroll = progressToScroll(progress);
        if (progress >= 1 || progress < 0) {
          return wrap(Math.floor(progress), scroll);
        }
        trigger.scroll(scroll);
      }
  
      function buildSeamlessLoop(items, spacing, animateFunc) {
        let rawSequence = gsap.timeline({paused: true}), // this is where all the "real" animations live
          seamlessLoop = gsap.timeline({ // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
            paused: true,
            repeat: -1, // to accommodate infinite scrolling/looping
            onRepeat() { // works around a super rare edge case bug that's fixed GSAP 3.6.1
              this._time === this._dur && (this._tTime += this._dur - 0.01);
            },
            onReverseComplete() {
              this.totalTime(this.rawTime() + this.duration() * 100); // seamless looping backwards
            }
          }),
          cycleDuration = spacing * items.length,
          dur; // the duration of just one animateFunc() (we'll populate it in the .forEach() below...
  
        // loop through 3 times so we can have an extra cycle at the start and end - we'll scrub the playhead only on the 2nd cycle
        items.concat(items).concat(items).forEach((item, i) => {
          let anim = animateFunc(items[i % items.length]);
          rawSequence.add(anim, i * spacing);
          dur || (dur = anim.duration());
        });
  
        // animate the playhead linearly from the start of the 2nd cycle to its end (so we'll have one "extra" cycle at the beginning and end)
        seamlessLoop.fromTo(rawSequence, {
          time: cycleDuration + dur / 2
        }, {
          time: "+=" + cycleDuration,
          duration: cycleDuration,
          ease: "none"
        });
        return seamlessLoop;
      }
  
  
      // AUTOSCROLL
    //   let scrollSpeed = 10

    //   setTimeout(() => {
    //     cancelAnimationFrame(animRef.current)
    //   }, 700)

    //   const scrollFunc = () => {
    //     if (!isDragging) {
    //         // scrub.vars.offset = scrub.vars.offset + 0.004
    //         // scrub.invalidate().restart();
    //         // scrollToOffset(scrub.vars.offset)
    //       window.scrollBy(0, scrollSpeed)
    //       animRef.current = requestAnimationFrame(scrollFunc)
    //     } else {
    //       cancelAnimationFrame(animRef.current)
    //     }
    //   }
  
    //   const pauseAutoScroll = () => {
    //     isDragging = true
    //     cancelAnimationFrame(animRef.current)
    //   };
  
    //   const resumeAutoScroll = () => {
    //     isDragging = false
    //     animRef.current = requestAnimationFrame(scrollFunc)
    //   };
  
    //   scrollFunc()
    // //   document.addEventListener('mousedown', pauseAutoScroll); 
    // //   document.addEventListener('mouseup', resumeAutoScroll);
    // //   document.addEventListener('touchstart', pauseAutoScroll); 
    // //   document.addEventListener('touchend', resumeAutoScroll);
  
      // below is the dragging functionality (mobile-friendly too)...
      Draggable.create(".drag-proxy", {
        type: "y", /* Updated */
        trigger: ".cards",
        onPress() {
          this.startOffset = scrub.vars.offset;
        },
        onDrag() {
          scrub.vars.offset = this.startOffset + (this.startY - this.y) * 0.001; /* Updated */
          scrub.invalidate().restart(); // same thing as we do in the ScrollTrigger's onUpdate
        },
        onDragEnd() {
          scrollToOffset(scrub.vars.offset);
        }
      })
  
      return () => {
        trigger.disable()
        // document.removeEventListener('mousedown', pauseAutoScroll);
        // document.removeEventListener('mouseup', resumeAutoScroll);
        // document.removeEventListener('touchstart', pauseAutoScroll); 
        // document.removeEventListener('touchend', resumeAutoScroll);
        // cancelAnimationFrame(scrollFunc);
      };
  
    },[])

    const repeatQ = 6

    const future = []
    for (let i = 0; i < repeatQ; i++) {
        future.push(
        <React.Fragment key={i}>
                <li>Initiative</li>
                <li>Urheberrecht, AT</li>
                <li>© Musik</li>
                <li>Initiative</li>
                <li>Urheberrecht, AT</li>
                <li>© Film und Theater</li>
                <li>Initiative</li>
                <li>Urheberrecht, AT</li>
                <li>© Literatur</li>
                <li>Initiative</li>
                <li>Urheberrecht, AT</li>
                <li>© Bildende Kunst</li>
        </React.Fragment>
        )
    }

    const now = []
    for (let i = 0; i < repeatQ; i++) {
        now.push(
        <React.Fragment key={i}>
            <li>Initiative</li>
            <li>Urheberrecht, AT</li>
            <li><span style={{letterSpacing: '-0.12em'}}>©</span> Konferenz</li>
            <li>KI, GVR und Streaming</li>
            <li>22.–23. November 2023</li>
        </React.Fragment>
        )
    }
  
    return (
      <>
        {/* {isLoading && <div className="lds-circle"><div></div></div>} */}
        <container id='poster' ref={posRef}>
            <div className={`gallery ${isDayTime ? `day` : `night`}`} ref={galRef} >
              <ul className='cards' ref={carRef} style={{opacity: 0}}>
                  {now}
              </ul>
            </div>
            <div className='drag-proxy'></div>
        </container>
      </>
    )
}