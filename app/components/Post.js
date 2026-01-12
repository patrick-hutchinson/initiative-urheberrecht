import {PortableText} from '@portabletext/react'
import { useEffect, useRef, useState } from 'react'
import PostToolbar from './PostToolbar'
import VideoEmbed from './VideoEmbed'
import SimpleImageSlider from "react-simple-image-slider";

export default function Post({ data }) {
    const pRef = useRef()
    const [opened, setOpened] = useState(false)

    const toggleOpened = () => {
        opened ? setOpened(false) : setOpened(true) 
    }

    return (
      <div 
        ref={pRef} 
        className={`presse-posts-post ${data.archive ? 'is-past' : ''} ${data.inverse ? 'is-inverse' : ''} ${opened ? 'opened' : ''}`} 
        data-index={data.anchors && data.anchors.join(' ')}
      >
        <div className='presse-posts-container'>
            <PortableText value={data.title}/>
        </div>
        <PostToolbar 
            toggleF={toggleOpened} 
            selectedMedia={data.media.selectedMedia} 
            download={data.file && data.file.url ? data.file.url : false}
            filename={data.filename}
            open = {opened}
        />
        {  
            data.media && (
                <div className='media'>
                    {
                        data.media.selectedMedia == 'embedVideo' && (
                            <div className='embed-video'>
                                <VideoEmbed url={data.media.embedVideo.url} />
                            </div>
                        )
                    }
                     {
                        data.media.selectedMedia == 'photos' && (
                            <div className='photos'>
                                <SimpleImageSlider
                                    width={262}
                                    height={205}
                                    images={data.media.photos.images}
                                    showBullets={false}
                                    showNavs={true}
                                    autoPlay={true}
                                />
                            </div>
                        )
                    }
                </div>
            )

        }

      </div>
    )

}