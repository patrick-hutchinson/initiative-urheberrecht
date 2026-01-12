import { useEffect } from 'react';

function vhSetter() {
  useEffect(() => {
    const updateVH = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    updateVH()
    window.addEventListener('resize', updateVH)

    return () => {
      window.removeEventListener('resize', updateVH)
    }
  }, [])

  return null
}

export default vhSetter;