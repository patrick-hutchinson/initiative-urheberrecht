import styles from './index.module.scss';
import { useRef, useState, useEffect, useContext } from 'react';
import { gsap } from 'gsap';
import { FotoarchivContext } from '../../contexts/FotoarchivContext';
import useWindowDimensions from '../useWindowDimensions';

export default function FotoarchivToolbar({ src }) {
  const { fotoarchivState, storeFotoarchivState } = useContext(FotoarchivContext);
  const { width } = useWindowDimensions();
  const konferenzenBottomRef = useRef(null);
  const [konferenzenOpen, setKonferenzenOpen] = useState(false);

  const fotoarchivStateRef = useRef(fotoarchivState);

  useEffect(() => {
    fotoarchivStateRef.current = fotoarchivState;
  }, [fotoarchivState]);

  const showKonferenzen = () => {
    setKonferenzenOpen(true);

    konferenzenBottomRef.current.style.visibility = 'visible';
    gsap.to(konferenzenBottomRef.current, {
      autoAlpha: 1,
      duration: 0.5,
      ease: 'power1.inOut'
    });
  }

  const openKonferenzen = () => {
    fotoarchivState.part !== 'konferenz' && 
      storeFotoarchivState(prev => ({ 
        ...prev, 
        part: 'konferenz', 
        id: 0,
        folder: 0,
        slide: 0
      }));

    showKonferenzen();
  }

  const closeKonferenzen = () => {
    setKonferenzenOpen(false);

    gsap.to(konferenzenBottomRef.current, {
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power1.inOut',
      onComplete: () => {
        konferenzenBottomRef.current.style.visibility = 'hidden';
      }
    });
  }

  const toggleKonferenzen = () => {
    if (konferenzenOpen) {
      closeKonferenzen();
    } else {
      openKonferenzen();
    }
  }   

  useEffect(() => {
    fotoarchivState.part === 'konferenz' && openKonferenzen();
  }, [fotoarchivState]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        showKonferenzen();
      } else {  
        fotoarchivStateRef.current.part !== 'konferenz' && closeKonferenzen();  
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
      <section className={styles['fotoarchiv-toolbar']}>
        <div className={styles['konferenzen']}>
          <div 
            className={`${styles['konferenzen__top']} ${fotoarchivState.part === 'konferenz' ? styles['konferenzen__top--active'] : ''}`}
          >
            <a onClick={() => {
              window.innerWidth >= 992 ? toggleKonferenzen() : openKonferenzen();
            }}>
              <h3>Konferenzen</h3>
            </a>
          </div>
          <div 
            ref={konferenzenBottomRef}
            className={`${styles['konferenzen__bottom']} ${konferenzenOpen ? styles['konferenzen__bottom--opened'] : ''}`} 
          >
            {src.konferenz.map((konferenz, index) => (
              <div 
                className={`${styles['item']} ${fotoarchivState.part === 'konferenz' && fotoarchivState.id === index ? styles['item--active'] : ''}`} 
                key={index} 
              >
                {(fotoarchivState.part === 'konferenz' && fotoarchivState.id === index) ?
                  <h3>
                    {konferenz.menuTitle}
                    {width < 992 && 
                        index < src.konferenz.length - 1 
                          && <span>, </span>
                    }
                  </h3> :
                  <a onClick={() => {
                    storeFotoarchivState(prev => ({ 
                      ...prev, 
                      part: 'konferenz', 
                      id: index,
                      folder: 0,
                      slide: 0
                    }));
                    window.innerWidth >= 992 && closeKonferenzen();
                  }}>
                    <h3>
                      {konferenz.menuTitle}
                      {width < 992 && 
                        index < src.konferenz.length - 1 
                          && <span>, </span>
                      }
                    </h3>
                  </a>
                }
              </div>
            ))}
          </div>
        </div>
        <div className={styles['presse']}>
          {src.presse.map((presse, index) => (
            <div 
              className={`${styles['item']} ${fotoarchivState.part === 'presse' && fotoarchivState.id === index ? styles['item--active'] : ''}`} 
              key={index} 
            >
              {(fotoarchivState.part === 'presse' && fotoarchivState.id === index) ?
                <h3>{presse.menuTitle}</h3> :
                <a onClick={() => {
                  storeFotoarchivState(prev => ({ 
                    ...prev, 
                    part: 'presse', 
                    id: index,
                    folder: 0,
                    slide: 0
                  }));
                  window.innerWidth >= 992 && closeKonferenzen();
                }}>
                  <h3>{presse.menuTitle}</h3>
                </a>
              }
            </div>
          ))}
        </div>           
      </section>
  )
}