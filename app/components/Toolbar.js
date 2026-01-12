import { useRouter } from "next/router"
import gsap from 'gsap'
import useWindowDimensions from '../components/useWindowDimensions'
import { useEffect, useRef, useState } from 'react'

export default function Toolbar({ anchorsTitle, anchors, download, closeFunc, }) {
    const router = useRouter()
    const {width, height} = useWindowDimensions()

    const [closeUrl, setCloseUrl] = useState('')

    useEffect(() => {
       localStorage.getItem(`darkmode`) === 'true'
       ? setCloseUrl("/close-overlay-black.svg") 
       : setCloseUrl("/close-overlay-white.svg")

    }, [])

    const shareLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}${router.asPath}`)
        .then(() => {
            alert('Link copied to clipboard!')
        })
        .catch(err => {
            console.error('Failed to copy text: ', err)
        })
    }

    function scrollTo (y) {
        gsap.to(document.querySelector('.ReactModal__Content'), {
            scrollTo: y,
            duration: 1.2,
            ease: "power1.inOut",
        })
    }

    return (
        <section className="toolbar">
            {width >= 1366 && (
                anchors && (
                    <div className="toolbar-anchors">
                        <h3 className="toolbar-anchors-title">{anchorsTitle}</h3>
                        {anchors.map((a, i) => (
                            <a key={i} onClick={() => scrollTo(document.querySelector(`[data-index="${i}"]`).offsetTop - 17)}>
                                <h3>{a.title}</h3>
                            </a>
                        ))}
                    </div>
                )
            )}

            {width >= 992 ? (
                <>
                    {download && <a href={download} target="_blank" rel="noopener noreferrer"><h3>Download .pdf</h3></a>}
                    {/* <a onClick={shareLink}><h3>Share</h3></a> */}
                    <a onClick={closeFunc}><h3>Close</h3></a>
                </>
            ) : (
                <>
                    {/* {download && <a href={download} target="_blank" rel="noopener noreferrer"><img src="./downloads-white.svg" alt="Download PDF" width="14px" height="14px" /></a>} */}
                    {/* <a onClick={shareLink}><img src="./share.svg" alt="Share" width="23px" height="14px" /></a> */}
                    <a onClick={closeFunc}><img src={closeUrl} alt="Close" width="14px" height="14px" /></a>
                </>
            )}
        </section>
    )
    
}