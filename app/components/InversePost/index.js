import styles from './index.module.scss'
import { PortableText } from '@portabletext/react'
import Link from 'next/link';
import { useContext } from 'react';
import { FotoarchivContext } from "/contexts/FotoarchivContext"

export default function InversePost({ data, openModal }) {
  const { fotoarchivState, storeFotoarchivState } = useContext(FotoarchivContext);
  const isFotoarchiv = data.anchors.includes('Fotoarchiv');
  return (
      <div 
          className={`presse-posts-post ${styles['inverse-post']}`}
          data-index={data.anchors && data.anchors.join(' ')}
      >
          <div className='presse-posts-container'>
          {data.file && data.file.url ? 
            <Link href={data.file.url} target='_blank'>
                <PortableText value={data.title}/>
            </Link> : 
            <PortableText value={data.title}/>
          }
          {isFotoarchiv && (
            <a onClick={() => {
              openModal('fotoarchiv')
              storeFotoarchivState(prev => ({
                ...prev,
                mode: 'grid',
                part: 'presse',
                id: 0,
                folder: 0,
                slide: 0
              }));
            }}>
              <p>Fotoarchiv</p>
            </a>
          )}
          </div>
      </div>
  )
}