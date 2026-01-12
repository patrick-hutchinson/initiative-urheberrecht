import React from 'react';
import useWindowDimensions from '../components/useWindowDimensions';

export default function VideoEmbed({ url, presse = true }) {
  const {width, height} = useWindowDimensions()
  
  let embedUrl = '';

  if (url.includes('vimeo')) {
    const videoId = url.split('/').pop();
    embedUrl = `https://player.vimeo.com/video/${videoId}`;
  } else if (url.includes('youtube')) {
    const videoId = url.split('v=').pop();
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  return (
    <div style={presse ? { background: 'black' } : {}}>
        <iframe
        src={embedUrl}
        style={presse ? {
          border: '0',
          padding: '0',
          margin: '0',
          width: '200px',
          zoom: 1.3,
        } : {
          border: '0',
          padding: '0',
          margin: '0',
          width: 'calc(100vw - calc(var(--border) * 1.5 * 2))',
          height: 'calc(calc(100vw - calc(var(--border) * 1.5 * 2)) * 9 / 16',
        }}
        allow="autoplay; fullscreen"
        allowFullScreen
        title="Embedded Video"
      ></iframe>
    </div>
      
  )
}

