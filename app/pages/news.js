import React, { useEffect } from 'react';
import { useRouter } from 'next/router'; // Make sure you import useRouter
import { MainLayout } from '/components/MainLayout';
import Menu from '/components/Menu';
import Footer from '/components/Footer';
import client from '/sanityClient';
import showAfterLoad from '../components/showAfterLoad';
import { gsap } from 'gsap';

export default function News({ menuItems }) {
    const router = useRouter(); // Initialize useRouter

    showAfterLoad();

    useEffect(() => {
        // Load the Elfsight script dynamically
        const script = document.createElement('script');
        script.src = 'https://static.elfsight.com/platform/platform.js';
        script.setAttribute('data-use-service-core', 'true');
        script.defer = true;
        document.body.appendChild(script);

        // Cleanup function to remove the script when component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        document.body.style.background = getComputedStyle(document.documentElement).getPropertyValue('--color_white');
    }, []);

    const handleNavigation = (path) => {
        gsap.to([document.querySelector('.page'), document.querySelector('nav'), document.querySelector('#news')], {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                router.push(path);
            }
        });
    };

    return (
        <MainLayout>
            <section id="news" className="page" style={{ opacity: 0 }}>
                <div className='presse-title'>
                        <h1>
                            <span style={{ letterSpacing: '-0.06em'}}>
                                <a onClick={() => handleNavigation('/')} className="no-underline">©</a>
                            </span>
                            &nbsp;News
                        </h1>
                </div>
                <div className="elfsight-app-2a4d1154-e4b8-41ac-913a-0190dd03da46" data-elfsight-app-lazy></div>
            </section>

            <Menu data={menuItems} />
        </MainLayout>
    );
}

export async function getStaticProps() {
    const menuItems = await client.fetch(`
      *[defined(menuTitle) && id != "datenschutz" && id != null] | order(order asc) {
        id,
        menuTitle,
        slug
      }
    `);

    return {
        props: {
            menuItems
        },
        revalidate: 3600, // Revalidate every hour (was 1 second - too aggressive)
    };
}
