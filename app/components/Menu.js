import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link'
import { useRouter } from 'next/router';
import Overlay from './DesignOverlay';
import MenuFooter from './MenuFooter';
import useWindowDimensions from '../components/useWindowDimensions';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import _ from 'lodash';

export default function Menu({ data }) {
    const [opened, setOpened] = useState(false)
    const opRef = useRef()
    const clRef = useRef()
    const listRef = useRef()
    const uiRef = useRef()
    const backRef = useRef()
    const dataKonferenz = data.filter(item => item.id === "konferenz").reverse()
    const dataOther = data.filter(item => item.id !== "konferenz")

    const router = useRouter()

    const {width, height} = useWindowDimensions()

    gsap.registerPlugin(ScrollTrigger)

    const toggleOpen = () => {
        opened ? setOpened(false) : setOpened(true)
    }

    const handleNavigation = (path) => {
        if (router.asPath.includes('/konferenz') && path.includes('/konferenz')) {
            gsap.to([listRef.current, uiRef.current, document.querySelector('.page')], {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    toggleOpen()
                    router.push(path)
                    gsap.to([listRef.current, uiRef.current, document.querySelector('.page')], {
                        opacity: 1,
                        duration: 1,
                        delay: 1
                    })
                }
            })
        } else {
            gsap.to([listRef.current, uiRef.current, document.querySelector('.page')], {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    router.push(path);
                }
            })
        }       
    }

    useEffect(() => {
        const h1s = [...document.querySelectorAll('#menu-list h1')]
        if (opened) {            
            // h1s.forEach((item, i) => {
            //     const anim = gsap.fromTo(item, {
            //         autoAlpha: 0,
            //         scale: 0.96,
            //         transformOrigin: '0 0',
            //         immediateRender: false,
            //         overwrite: true,
            //     }, {
            //         duration: 0.5,
            //         autoAlpha: 1,
            //         scale: 1,
            //         delay: i * 0.05  // Delay each animation by 0.7 seconds multiplied by its index
            //     });
                    
            //     ScrollTrigger.create({
            //         trigger: item,
            //         animation: anim,
            //         toggleActions: 'play none none none',
            //         once: true,
            //         immediateRender: false,
            //         overwrite: true,
            //     });
            // })

            gsap.to([listRef.current, backRef.current], {
                opacity: 1,
                duration: 1,
                immediateRender: false,
                overwrite: true,
                // y: 0,
                onComplete: () => {
                    listRef.current.style.overflow = 'hidden'
                }
            })

            listRef.current.style.display = 'block'
            backRef.current.style.display = 'block'
            listRef.current.scrollTop = 0
            document.body.style.overflow = 'hidden'
              
        } else {
            document.body.style.overflow = ''
            gsap.to([listRef.current, backRef.current], {
                opacity: 0,
                duration: 1,
                immediateRender: false,
                overwrite: true,
                // y: 4,
                onComplete: () => {
                    listRef.current ? listRef.current.style.display = 'none' : ''
                    backRef.current ? backRef.current.style.display = 'none' : ''
                } 
            })
        }
       
    }, [opened])

    return (
        <nav style={{ opacity: 0 }}>
            <section id='menu-ui' ref={uiRef} className={`hamburger-icon-container ${opened ? 'hamburger-active' : ''}`} onClick={toggleOpen}>
                <span ref={opRef} className='hamburger-icon icon-black'></span>
            </section>
            
            {/* <section ref={listRef} id='menu-list' style={{ display: 'none', transform: 'translateY(6px)' }}> */}
            <section ref={listRef} id='menu-list' style={{ display: 'none', overflow: height < 505 ? 'scroll' : 'hidden'}}>
                <div className='block-title'>
                    <h1><a className="no-underline" onClick={() => handleNavigation(`/`)}>©</a></h1>
                </div>
                <div className='block-list'>
                    {router.asPath === `/news` 
                        ? 
                            <h1>
                                News
                            </h1>
                        : 
                            <h1>
                                <a onClick={() => handleNavigation(`/news`)}>
                                    News
                                </a>
                            </h1>
                    }
                    <br/>
                    {router.asPath === `/about` 
                        ? 
                            <h1>
                                About
                            </h1>

                        : 
                            <h1>
                                <a onClick={() => handleNavigation(`/about`)}>
                                    About
                                </a>
                            </h1>
                    }
                    <br/>
                    {dataKonferenz &&
                        <>
                            <h1>Konferenzen</h1>
                            <br/>
                                {dataKonferenz.map((mt, index) => (
                                    <React.Fragment key={index}>
                                        {router.asPath === `/konferenz/${mt.slug.current}` 
                                            ? 

                                                <h1 className="menu-konferenz__item" key={index}>
                                                    {mt.menuTitle}
                                                    {index < dataKonferenz.length - 1 && <span>,&nbsp;</span>}
                                                </h1>

                                            : 

                                                <h1 className="menu-konferenz__item" key={index}>
                                                    <a onClick={() => handleNavigation(`/konferenz/${mt.slug.current}`)}>
                                                        {mt.menuTitle}
                                                    </a>
                                                    {index < dataKonferenz.length - 1 && <span>,&nbsp;</span>}
                                                </h1>

                                        }
                                    </React.Fragment>
                                ))}
                        </>
                    }
                    <br/>
                    {router.asPath === `/organisation` 
                        ? 
                            <h1>
                                Organisation
                            </h1>

                        : 
                            <h1>
                                <a onClick={() => handleNavigation(`/organisation`)}>
                                    Organisation
                                </a>
                            </h1>
                    }
                    <br/>
                    {router.asPath === `/forderungen` 
                        ? 
                            <h1>
                                Forderungen
                            </h1>

                        : 
                            <h1>
                                <a onClick={() => handleNavigation(`/forderungen`)}>
                                    Forderungen
                                </a>
                            </h1>
                    }
                    <br/>
                    {router.asPath === `/presse` 
                        ? 
                            <h1>
                                Presse
                            </h1>

                        : 
                            <h1>
                                <a onClick={() => handleNavigation(`/presse`)}>
                                    Presse
                                </a>
                            </h1>
                    }
                    <br/>
                    {router.asPath === `/contact` 
                        ? 
                            <h1>
                                Kontakt
                            </h1>

                        : 
                            <h1>
                                <a onClick={() => handleNavigation(`/contact`)}>
                                    Kontakt
                                </a>
                            </h1>
                    }

                </div>

                <MenuFooter/>
            </section>
            <div id='menu-background' ref={backRef}>
            </div>
        </nav>
    )
}