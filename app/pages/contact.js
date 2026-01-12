import { MainLayout } from "../components/MainLayout"
import React, { useEffect, useRef, useState, useLayoutEffect, use } from 'react';
import { gsap } from "gsap/dist/gsap";
import Menu from '../components/Menu';
import client from '../sanityClient';
import showAfterLoad from "../components/showAfterLoad";
import {PortableText} from '@portabletext/react'
import Footer from "../components/Footer"
import { useRouter } from "next/router";
import NewsletterSubscription from "../components/NewsletterSubscription";
import useWindowDimensions from '../components/useWindowDimensions';
import showWhenInView from "../components/showWhenInView";
import ContactForm from "../components/ContactForm";

export default function Contact({ contact, menuItems }) {
  const router = useRouter()
  const {width, height} = useWindowDimensions()

  showAfterLoad({ showIn: 'false' }, () => {
    document.body.style.background = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color_black')
  })

  const closeOverlay = () => {
    gsap.to(document.querySelector('.container'), {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          router.back({ scroll: false })
        }
    })
  }
  
    return (
      <MainLayout>
        <section className="container page" style={{ opacity: 0 }}>
          <section id='menu-ui' className={`hamburger-icon-container hamburger-active`} onClick={closeOverlay}>
            <span className='hamburger-icon icon-white'></span>
          </section>
          
          <section id="contact">
            {width < 992 &&
              <div className="top">
                <h1 className="white">
                  <a className="no-underline white" onClick={() => handleNavigation('/')}><span style={{ letterSpacing: '-0.06em'}}>©</span></a>
                  {width < 576 ? (<br/>) : (` `)}
                  Newsletter
                </h1>
              </div>
            }
            <div className="left">
              <div className="margin-left-s">
                <div>
                  <h3 className="white">
                    <PortableText value={contact.infoLeft}/>
                  </h3>
                </div>
                <ContactForm/>
              </div>
            </div>
            <div className="right">
              <div className="margin-left-s">
                <h3 className="white">
                  <PortableText value={contact.infoRight}/>
                </h3>
              </div>
            </div>
            {width > 992 && 
              <div className="bottom">
                <h1 className="white">Newsletter</h1>
              </div>
            }
            <div className="footer-container">
              {width > 992 
                ? <Footer leftCol={false} transparent={true}/>
                : <Footer leftCol={true} transparent={true}/>
              }
            </div>
          </section>
        </section>
      </MainLayout>
        
    )
}

export async function getStaticProps() {
  const [contact] = await client.fetch(`
    *[_type == "contact"]
  `)
  const menuItems = await client.fetch(`
    *[defined(menuTitle) && id != "datenschutz" && id != null] | order(order asc) {
      id,
      menuTitle,
      slug
    }
  `)
  return {
    props: {
      contact, menuItems
    },
    revalidate: 3600, // Revalidate every hour
  }
}