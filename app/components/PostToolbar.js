import useWindowDimensions from '../components/useWindowDimensions';
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap';

export default function PostToolbar({ toggleF, download = '', filename = '', selectedMedia, open }) {
    const {width, height} = useWindowDimensions()
    const dowRef = useRef()
    const [arrowUrl, setArrowUrl] = useState('')
    const downloadOrigFileName = getOrigFileName(download);

    useEffect(() => {
       localStorage.getItem(`darkmode`) === 'true'
       ? setArrowUrl("./toggle-accordeon-white.svg") 
       : setArrowUrl("./toggle-accordeon-black.svg")

    }, [])

    useEffect(() => {
        if (dowRef.current) {
            if (open) {
                dowRef.current.style.display = 'block'
                gsap.to(dowRef.current, { opacity: 1 })
            } else {
                gsap.to(dowRef.current, { opacity: 0, onComplete: () => dowRef.current ? dowRef.current.style.display = 'none' : ''})
            }
        }
    }, [open])

    function getOrigFileName(url) {
        if (typeof url === 'string') {
          return url.substring(url.lastIndexOf('/') + 1);
        }
        return '';
      };

    return (
      <div className="post-toolbar">
        {
            selectedMedia !== "none" && download && 
            <h3 ref={dowRef} style={{ display: 'none', opacity: 0 }}>  
                {
                    filename && filename.includes('pdf')
                        ?
                            <a href={download} target="_blank" rel="noopener noreferrer">
                                Files
                            </a>
                        :
                            <a href={`/api/files/${downloadOrigFileName}?filename=${filename}`} target="_blank" rel="noopener noreferrer">
                                Files
                            </a>
                }
            </h3>
        }
        {
            selectedMedia === "photos" && 
            <h3>
                <a onClick={toggleF}>
                    {width > 576 && <span>{!open ? 'Bilder einsehen' : 'Bilder schließen'}</span>}
                    <img className='arrow' src={arrowUrl} alt="Toggle" width="14px" height="14px" />
                </a>
            </h3>

        }
        {
            selectedMedia === "embedVideo" && 
            <h3>
                <a onClick={toggleF}>
                    {width > 576 && <span>{!open ? 'Video öffnen' : 'Video schließen'}</span>}
                    <img className='arrow' src={arrowUrl} alt="Toggle" width="14px" height="14px" />
                </a>
            </h3>

        }

        {
            selectedMedia === "none" && download && 
            <h3>
                {
                    filename && filename.includes('pdf')
                        ?
                            <a href={download} target="_blank" rel="noopener noreferrer">
                                Files
                            </a>
                        :
                            <a href={`/api/files/${downloadOrigFileName}?filename=${filename}`} target="_blank" rel="noopener noreferrer">
                                Files
                            </a>
                }
            </h3>
        }
      </div>
    )
}
