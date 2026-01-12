import Link from "next/link"
import { useRouter } from 'next/router';
import useWindowDimensions from '../components/useWindowDimensions';
import gsap from 'gsap';

export default function Footer ({ leftCol = true, transparent = false }) {
    const router = useRouter()
    const {width, height} = useWindowDimensions()

    const handleNavigation = (path) => {
        const menuUI = document.body.querySelector('#menu-ui')
        const menuList = document.body.querySelector('#menu-list')
        const contact = document.body.querySelector('#contact')
        gsap.to([menuUI, menuList, contact], {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                router.push(path);
            }
        });
    }

    return (
        <section className={`footer`}>
            {width >= 768 
                ? 
                    router.asPath === '/konferenz' ? (
                        <>
                            <div>
                                {leftCol && (
                                    <a href='mailto:info@initiativeurheberrecht.at'>
                                        <h3>Zur Konferenz anmelden: info@initiativeurheberrecht.at</h3>
                                    </a>
                                )}
                            </div>
                            <div>
                                {/* <div>
                                    <h3>© Initiative Urheberrecht, AT</h3>
                                </div> */}
                                    <div className="footer-social-media">
                                        <a href="https://www.facebook.com/initiativeurheberrechtoesterreich" target="_blank">
                                            <h3>Facebook</h3>
                                        </a>
                                        <a href="https://www.instagram.com/initiativeurheberrecht_at/" target="_blank">
                                            <h3>Instagram</h3>
                                        </a>
                                        <a href="https://www.youtube.com/@InitiativeUrheberrechtAT" target="_blank">
                                            <h3>YouTube</h3>
                                        </a>
                                    </div>
                                <div>
                                    <a onClick={() => handleNavigation('/datenschutz')}><h3>Imprint, Datenschutz</h3></a>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                {leftCol && (
                                    <>
                                        <h3>© Initiative Urheberrecht, AT</h3>
                                        {router.asPath !== '/datenschutz' && <a onClick={() => handleNavigation('/contact')}><h3>Join Newsletter</h3></a>}
                                    </>

                                )}
                            </div>
                            <div>
                                {/* <div>
                                    <h3>© Initiative Urheberrecht, AT</h3>
                                </div> */}
                                    <div className="footer-social-media">
                                        <a href="https://www.facebook.com/initiativeurheberrechtoesterreich" target="_blank">
                                            <h3>Facebook</h3>
                                        </a>
                                        <a href="https://www.instagram.com/initiativeurheberrecht_at/" target="_blank">
                                            <h3>Instagram</h3>
                                        </a>
                                        <a href="https://www.youtube.com/@InitiativeUrheberrechtAT" target="_blank">
                                            <h3>YouTube</h3>
                                        </a>
                                    </div>
                                    <div>
                                        {router.asPath !== `/datenschutz` ? (
                                            <a onClick={() => handleNavigation('/datenschutz')}><h3>Imprint, Datenschutz</h3></a>
                                        ) : (
                                            <h3 className="grey">Imprint, Datenschutz</h3>
                                        )}
                                    </div>
                            </div>
                        </>
                    )
                
                : 
                    (
                        <>
                            <div>
                                <a onClick={() => handleNavigation('./contact')}><h3>Join Newsletter</h3></a>
                                <div className="footer-social-media">
                                    <a href="https://www.facebook.com/initiativeurheberrechtoesterreich" target="_blank">
                                        <h3>Fb</h3>
                                    </a>
                                    <a href="https://www.instagram.com/initiativeurheberrecht_at/" target="_blank">
                                        <h3>Ig</h3>
                                    </a>
                                    <a href="https://www.youtube.com/@InitiativeUrheberrechtAT" target="_blank">
                                        <h3>Yt</h3>
                                    </a>
                                </div>
                            </div>
                            <div>
                                {router.asPath !== `/datenschutz` ? (
                                    <a onClick={() => handleNavigation('./datenschutz')}><h3>Imprint, Datenschutz</h3></a>
                                ) : (
                                    <h3 className="grey">Imprint, Datenschutz</h3>
                                )}
                            </div>
                        </>
                    )
            }
        </section>
    )
}