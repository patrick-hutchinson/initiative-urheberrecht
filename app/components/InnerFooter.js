import useWindowDimensions from '../components/useWindowDimensions';
import { gsap } from "gsap/dist/gsap"
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'

export default function InnerFooter({ closeFunc, download }) {
    const {width, height} = useWindowDimensions()

    gsap.registerPlugin(ScrollToPlugin)

    function scrollTo (y) {
        gsap.to(document.querySelector('.ReactModal__Content'), {
            scrollTo: y,
            duration: 1,
            ease: "power1.inOut"
        })
    }

    return (
        <div className='overlay-footer'>
            {
                width >= 768 ? (
                    <>   
                        <h1>
                            <a onClick={() => scrollTo(0)}>
                                Nach oben
                            </a>
                        </h1>                 
                        <h1>
                            <a onClick={closeFunc}>Close</a>
                        </h1>
                    </>

                ) : (
                    download 
                        ?
                            <>
                                <h1>
                                    <a href={download} target="_blank" rel="noopener noreferrer">.pdf</a>
                                </h1>
                                <h1>
                                    <a onClick={closeFunc}>Close</a>
                                </h1>

                            </>
                        :
                        <>
                            <h1>
                                <a onClick={() => scrollTo(0)}>
                                    Nach oben
                                </a>
                            </h1>                 
                            <h1>
                                <a onClick={closeFunc}>Close</a>
                            </h1>
                        </>

                )
            }

        </div>
    )
}