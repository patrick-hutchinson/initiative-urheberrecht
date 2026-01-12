import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { MainLayout } from "../components/MainLayout"
import Poster from '../components/Poster'
import { useRouter } from 'next/router';
import { gsap } from "gsap/dist/gsap";
import client from '../sanityClient';
import { drawConsoleLabel } from '../utils/consoleLabel';

export default function App({ konferenzes, poster }) {
  const router = useRouter()
  const hasRendered = useRef(false);

  useEffect(() => {
    if (!hasRendered.current) {
      drawConsoleLabel();
      hasRendered.current = true;
    }
  }, []);
  
  const goToKonf = () => {
    gsap.to(document.querySelector('.gallery'), {
      opacity: 0,
      duration: 1,
      onComplete: () =>  {
        router.push(`/konferenz/${konferenzes[konferenzes.length - 1].slug.current}`)
      } 
    })
  }

  return (
    <MainLayout>
      <section id="poster-frame" onClick={goToKonf} style={{ opacity: 1 }}>
        <Poster data={poster}/>
      </section>
    </MainLayout>
  )
}


export async function getStaticProps() {
  const konferenzes = await client.fetch(`
     *[_type == "konferenz"] {
      slug
    }
  `);

  const poster = await client.fetch(`
    *[_type == "poster"][0] {
      type,
      dates
    }
  `);

  return {
    props: {
      konferenzes,
      poster
    },
    revalidate: 3600, // Revalidate every hour (was 10 seconds - too aggressive)
  }
}