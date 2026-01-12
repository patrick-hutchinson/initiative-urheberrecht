import { FotoarchivContext } from '../../contexts/FotoarchivContext';
import { useContext, useEffect, useState } from 'react';
import styles from './index.module.scss';

export default function FotoarchivModeChanger() {
  const [changerEl, setChangerEl] = useState(null);
  const { fotoarchivState, storeFotoarchivState, toggleHeight } = useContext(FotoarchivContext);
  
  const [computedTop, setComputedTop] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (!changerEl) return;

    const updateTop = () => {
      const currentWidth = window.innerWidth;
      setWindowWidth(currentWidth);
      if (currentWidth >= 992) {
        const titleDiv = document.querySelector('.overlay-content-title');
        if (titleDiv) {
          const border = parseInt(
            getComputedStyle(document.documentElement)
              .getPropertyValue('--border').trim()
          ) * 1.5;
          const newTop = titleDiv.getBoundingClientRect().height - 24 - border;
          setComputedTop(newTop + "px");
        }
      } else {
        setComputedTop(null);
      }
    };

    updateTop();
    window.addEventListener('resize', updateTop);
    return () => {
      window.removeEventListener('resize', updateTop);
    };
  }, [changerEl]);

  const opacity = (computedTop || windowWidth < 992) ? 1 : 0;

  return (
    <section 
      className={`${styles['fotoarchiv-mode-changer']} fotoarchiv-mode-changer`}
      ref={setChangerEl}
      style={{ 
        top: computedTop || undefined,
        transition: 'opacity 0.3s ease',
        opacity: opacity,
      }}
    >
      <div className={`${styles['grid']} ${styles['icon-container']}`}>
        {fotoarchivState.mode === 'grid' ? 
          <div className={styles['icon']} /> :
          <a onClick={() => {
            storeFotoarchivState(prev => ({ ...prev, mode: 'grid' }));
            toggleHeight('grid');
          }}>
            <div className={styles['icon']} />
          </a>
        }
      </div>
      <div className={`${styles['slides']} ${styles['icon-container']}`}>
        {fotoarchivState.mode === 'slides' ? 
          <div className={styles['icon']} /> :
          <a onClick={() => {
            storeFotoarchivState(prev => ({ ...prev, mode: 'slides' }));
            toggleHeight('slides');
          }}>
            <div className={styles['icon']} />
          </a>
        }
      </div>
    </section>
  );
}