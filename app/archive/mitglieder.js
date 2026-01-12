import { MainLayout } from "../components/MainLayout"
import React, { useEffect, useRef, useState, useContext } from 'react';
import { gsap } from "gsap/dist/gsap";
import Menu from '../components/Menu';
import client from '../sanityClient';
import Image from 'next/image'
import Link from "next/link";
import Overlay from '../components/Overlay';
import resizeListener from '../components/resizeListener';
import {PortableText} from '@portabletext/react'
import showAfterLoad from '../components/showAfterLoad';
import { OverlaysContext } from "../contexts/OverlaysContext"
import MenuFooter from "../components/MenuFooter";
import useWindowDimensions from '../components/useWindowDimensions';
import headlinesResizer from '../components/headlinesResizer';
import { MenuContext } from "../contexts/MenuContext"
import { useNextImageFade } from '../components/useNextImageFade';
import showWhenInView from "../components/showWhenInView";
import { useRouter } from 'next/router';

export default function Mitglieder({ mitglieder, menuItems }) {
    const {overlays, storeOverlays, resetOverlays, closeEvent, storeCloseEvent, openEvent, storeOpenEvent  } = useContext(OverlaysContext)
    const { opened, storeOpened } = useContext(MenuContext)
    const mitAnchorRef = useRef()

    showAfterLoad()
    // headlinesResizer()
    showWhenInView()

    const router = useRouter()

    const {width, height} = useWindowDimensions()

    useEffect(() => {
      document.body.style.background = 'white'
    }, [])

    const registerOverlays = () => {
      storeOverlays([
          {
              ref: 'mitglieder-overlay',
              // anchorY: mitAnchorRef.current.offsetTop - 18,
              show: false,
          },
      ])
    }

    useEffect(() => {
        // localStorage.clear()
        resetOverlays()
        registerOverlays()

        // resizeListener(registerOverlays)
    }, [])

    useEffect(() => {
      if (closeEvent) {
          resetOverlays()
          registerOverlays(() => storeCloseEvent(false))
      }
    }, [closeEvent])

    const openOverlay = (ref, i) => {
      storeOverlays(prev => prev.map(overlay => {
          if (overlay.ref === ref) {
              return {
                  ...overlay,
                  show: true,
                  ...(i !== undefined && { i })
              }
          }
          return overlay
      }))
      storeOpenEvent(true)
    }

    const onBackgroundClick = () => {
      storeOpened(true)
    }

    const handleLiClick = (e) => {
      e.stopPropagation();
    }

    const handleNavigation = (path) => {
      gsap.to([document.querySelector('.page'), document.querySelector('nav')], {
          opacity: 0,
          duration: 1.3,
          onComplete: () => {
              router.push(path) 
          }
      })
    }

    return (
      <MainLayout>
        <section id="mitglieder" className='page' style={{ opacity: 0 }}>
          <div className='block-title'>
            <h1>
              <a className="no-underline" onClick={() => handleNavigation('/')}><span style={{ letterSpacing: '-0.03em'}}>© </span></a>
              {width < 576 && (<br/>)}
              {width >= 576 && (mitglieder.pageTitle)}
            </h1>
          </div>
          <ul className="mitglieder-list">
            <li onClick={handleLiClick}>
              <h1 ref={mitAnchorRef}>
                  <a onClick={() => openOverlay('mitglieder-overlay', 0)}>{mitglieder.verbande.title}</a>
              </h1>
            </li>
            <li onClick={handleLiClick}>
              <h1>
                  <a onClick={() => openOverlay('mitglieder-overlay', 1)}>{mitglieder.organisations.title}</a>
              </h1>
            </li>
            <li onClick={handleLiClick}>
              <h1>
                  <a onClick={() => openOverlay('mitglieder-overlay', 2)}>{mitglieder.rechtsbeistande.title}</a>
              </h1>
            </li>
          </ul>
          <MenuFooter/>
        </section>


        {/* MITGLIEDER OVERLAY */}
        <Overlay
                id='mitglieder-overlay'
                anchors={[{title: mitglieder.verbande.title}, {title: mitglieder.organisations.title}, {title: mitglieder.rechtsbeistande.title}]}
                anchorsTitle={'Mitglieder'} 
          >
            {
                  mitglieder.verbande && (
                    <>
                        <div className='overlay-content-title'>
                          <h1 data-index={0}><span style={{ letterSpacing: '-0.06em'}}>©{width < 576 && <br/>}</span> {mitglieder.verbande.title}</h1>
                        </div>
                        <div className='overlay-content-body'>
                            <div className='persons'>
                                {mitglieder.verbande.verband[0] && mitglieder.verbande.verband.map((v, index) => (
                                    <React.Fragment key={index}>
                                        <div className='person'>
                                            <div className='person-title'>
                                                <h3>
                                                    {v.title}
                                                    <PortableText value={v.description}/>
                                                </h3>
                                            </div>
                                            <div className='mitglieder-logo'>
                                              {v.imageUrl &&
                                                <Image
                                                    src={`${v.imageUrl}?dpr=1`}
                                                    srcSet={`${v.imageUrl}?dpr=2 2x`}
                                                    width='0'
                                                    height='0'
                                                    sizes='auto'
                                                    priority
                                                    // {...useNextImageFade('')}
                                                />
                                              }
                                            </div>
                                        </div>
                                        {
                                            width >= 768 && (
                                                (index % 4 === 3) && (
                                                    <>
                                                        <div></div>
                                                        <div className={index+1 !== mitglieder.verbande.verband.length ? 'divider' : ''}></div>
                                                    </>
                                                )
                                            )
                                        }
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </>
                  )
                }
                {
                  mitglieder.organisations && (
                    <>
                      <div className='overlay-content-title'>
                          <h1 data-index={1}>{mitglieder.organisations.title}</h1>
                      </div>
                      <div className='overlay-content-body'>
                        <div className="tatigkeiten-grid">
                            <div className="mitglieder-organisationen">
                                <PortableText value={mitglieder.organisations.description}/>
                            </div>
                        </div>
                        <div className='persons'>
                                {mitglieder.organisations.organisation[0] && mitglieder.organisations.organisation.map((o, index) => (
                                    <React.Fragment key={index}>
                                        <div className='person'>
                                            <div className='person-title'>
                                                <h3>
                                                    <Link href={o.url}>{o.url}</Link>
                                                </h3>
                                            </div>
                                            <div className='mitglieder-logo'>
                                              {o.imageUrl && 
                                                <Image
                                                    src={`${o.imageUrl}?dpr=1`}
                                                    srcSet={`${o.imageUrl}?dpr=2 2x`}
                                                    width='0'
                                                    height='0'
                                                    sizes='auto'
                                                    priority
                                                    // {...useNextImageFade('')}
                                                />
                                              }
                                            </div>
                                        </div>
                                        {
                                            width >= 768 && (
                                                (index % 4 === 3) && (
                                                    <>
                                                        <div></div>
                                                        <div className={index+1 !== mitglieder.organisations.organisation.length ? 'divider' : ''}></div>
                                                    </>
                                                )
                                            )
                                        }
                                    </React.Fragment>
                                ))}
                            </div>
                      </div>
                    </>
                  )
                }
                {
                  mitglieder.rechtsbeistande && (
                    <>
                      <div className='overlay-content-title'>
                          <h1 data-index={2}>{mitglieder.rechtsbeistande.title}</h1>
                      </div>
                      <div className='overlay-content-body'>
                        <div className='col-2-grid'>
                            {mitglieder.rechtsbeistande.people[0] && mitglieder.rechtsbeistande.people.map((p, index) => (
                                <React.Fragment key={index}>
                                    <div className='person'>
                                        <div className='person-title'><h3>{p.name} <br/> {p.regalia}</h3></div>
                                        <div className='person-photo'>
                                            {p.imageUrl && 
                                            <Image
                                                src={`${p.imageUrl}?dpr=1`}
                                                srcSet={`${p.imageUrl}?dpr=2 2x`}
                                                placeholder='blur'
                                                blurDataURL={p.blurDataURL.metadata.lqip}
                                                width='0'
                                                height='0'
                                                sizes='auto'
                                                priority
                                                // {...useNextImageFade('')}
                                            />
                                            }
                                        </div>  
                                        <div className='person-about'>
                                            <h3>
                                                <PortableText value={p.about}/>
                                            </h3>
                                        </div>
                                    </div>
                                    {
                                        width >= 768 && (
                                            (index % 4 === 3) && (
                                                <>
                                                    <div></div>
                                                    <div className={index+1 !== mitglieder.rechtsbeistande.people.length ? 'divider' : ''}></div>
                                                </>
                                            )
                                        )
                                    }
                                </React.Fragment>
                            ))}
                        </div>
                      </div>
                    </>
                  )
                }
          </Overlay>
          <Menu data={menuItems}/>
      </MainLayout>
        
    )
}

export async function getStaticProps() {
  const [mitglieder] = await client.fetch(`
    *[_type == "mitglieder"] {
      pageTitle,
      verbande {
        title,
        verband[]{
          title,
          description,
          "imageUrl": logo.asset->url,
        }
      },
      organisations {
        title,
        description,
        organisation[]{
          url,
          "imageUrl": logo.asset->url,
        }
      },
      rechtsbeistande {
        title,
        people[]->{
          name,
          regalia,
          about,
          "imageUrl": image.asset->url,
          "blurDataURL": image.asset->{
              metadata {
                  lqip
              }
          }
        }
      }
    }
  `)
  const menuItems = await client.fetch(`
      *[defined(menuTitle) && _id != "datenschutz"] | order(order asc) {
        _id,
        menuTitle,
      }
  `)
  return {
    props: {
      mitglieder, menuItems
    }
  }
}