import { MainLayout } from "../components/MainLayout"
import Footer from "../components/Footer"
import { useRouter } from "next/router";
import showAfterLoad from '../components/showAfterLoad';
import gsap from 'gsap';
import { useEffect } from "react";
import client from '../sanityClient';
import {PortableText} from '@portabletext/react'
import Link from "next/link";

export default function Dateschutz({ datenschutz }) {
    const router = useRouter()

    showAfterLoad()

    useEffect(() => {
      document.body.style.background = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color_black')
    }, [])

    const closeOverlay = () => {
      gsap.to(document.querySelector('.container'), {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            router.back({ scroll: false })
          }
      })
    }

    const leftBlockComp = {
      block: 
        ({children}) => (
          <h3>
            <p>
              {children}<br/><br/>
            </p>
          </h3>
        ),
        marks: {
          link: ({children, value}) => {
            return (
              <a href={value.href} rel='noreferrer noopener' target='_blank'>{children}</a>
            )
          }
        }
    }

    const rightBlockComp = {
      block: 
        ({children}) => (
          <div>
            <h3>
              <p>
                {children}<br/><br/>
              </p>
            </h3>
          </div>
        ),
        marks: {
          link: ({children, value}) => {
            return (
              <a href={value.href} rel='noreferrer noopener' target='_blank'>{children}</a>
            )
          }
        }
    }

    return (
      <MainLayout>
        <section className="container page" style={{ opacity: 0 }}>
          <section id='menu-ui' className={`hamburger-icon-container hamburger-active`} onClick={closeOverlay}>
            <span className='hamburger-icon icon-white'></span>
          </section>

          <div className="datenschutz">
            <div className="left-block margin-left-s">
                <PortableText value={datenschutz.leftBlock} components={leftBlockComp} />
            </div>

            <div></div>

            <div className="right-block">
              <PortableText value={datenschutz.rightBlock} components={rightBlockComp} />
              <div>
                <h3>
                  <p>
                    <Link href={datenschutz.downloadDatenschutz.url} target="_blank"><strong>Download Datenschutz.pdf</strong></Link>
                  </p>
                </h3>
              </div>
            </div>
          </div>
          <Footer/>
        </section>
        
      </MainLayout>
    )
}

export async function getStaticProps() {
  const [datenschutz] = await client.fetch(`
    *[_type == "datenschutz"] {
      menuTitle,
      leftBlock,
      rightBlock,
      downloadDatenschutz {
        "url": asset->url,
      },
    }
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
      datenschutz, menuItems
    },
    revalidate: 3600, // Revalidate every hour
  }
}