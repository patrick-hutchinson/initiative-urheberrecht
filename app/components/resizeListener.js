const resizeListener = (f) => {
  let timeout;
  const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(f, 300);
  };

  window.addEventListener('resize', handleResize);

  return () => {
      window.removeEventListener('resize', handleResize);
  }
}

export default resizeListener