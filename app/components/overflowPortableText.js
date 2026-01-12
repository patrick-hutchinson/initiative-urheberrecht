import React, { useRef, useState, useEffect } from 'react'
import {PortableText} from '@portabletext/react'
import { gsap } from "gsap/dist/gsap"
import resizeListener from './resizeListener';

export default function OverflowPortableText({ value, components = ''}) {
    const textRef = useRef(null)
    const [isOverflowed, setIsOverflowed] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [overflowHeight, setOverflowHeight] = useState(0)

    const handleClick = () => {
        if (isOverflowed) {
            toggleExpand()
        }
    }

    const setOverflowed = () => {
        if (textRef.current && textRef.current.scrollHeight - 10 > textRef.current.clientHeight) {
            setIsOverflowed(true);
        }
    }

    useEffect(() => {
        const updOverflowHeight = () => {
            setOverflowHeight(textRef.current.scrollHeight - textRef.current.clientHeight)
        }

        const updOverflowed = () => {
            setTimeout(setOverflowed(), 300)   
        }

        updOverflowHeight()
        setOverflowed()

        window.addEventListener('resize', updOverflowHeight);
        window.addEventListener('resize', updOverflowed);
        
        return () => {
            window.removeEventListener('resize', updOverflowHeight);
            window.removeEventListener('resize', updOverflowed);
        }
    }, [])

    useEffect(() => {
        if (isExpanded) {
            textRef.current.parentNode.querySelector('.uniblock-image').style.height = `${textRef.current.parentNode.querySelector('.uniblock-image').getBoundingClientRect().height}px`
            textRef.current.parentNode.style.display = 'block'
            textRef.current.classList.add('expanded')

            gsap.to(textRef.current.parentNode, {
                height: `calc(100vh + ${overflowHeight}px)`,
            })
        } else {    
            gsap.to(textRef.current.parentNode, {
                height: `calc(100vh + ${0}px)`,
                onComplete: () => {
                    if (textRef.current) { textRef.current.parentNode.style.display = 'flex'}
                    textRef.current && textRef.current.classList.remove('expanded')
                }
            })
        }
    }, [isExpanded]);
    

    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <>
        <div 
          className='uniblock-text'
          ref={textRef}
          onClick={handleClick}
        >
          <PortableText value={value} components={components}/>
        </div>

      </>
    );

}
