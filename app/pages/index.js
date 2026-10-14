import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { MainLayout } from "../components/MainLayout";
import Poster from "../components/Poster";
import { useRouter } from "next/router";
import { gsap } from "gsap/dist/gsap";
import client from "../client";
import { newestConferenceFirst } from "../utils/conferenceOrder";
import { drawConsoleLabel } from "../utils/consoleLabel";
import SanityPreviewFallback, { shouldShowSanityPreviewFallback } from "../components/SanityPreviewFallback";

export default function App({ konferenzes, poster }) {
  const router = useRouter();
  const hasRendered = useRef(false);

  useEffect(() => {
    if (!hasRendered.current) {
      drawConsoleLabel();
      hasRendered.current = true;
    }
  }, []);

  if (shouldShowSanityPreviewFallback(konferenzes, poster)) {
    return (
      <MainLayout>
        <SanityPreviewFallback />
      </MainLayout>
    );
  }

  const goToKonf = () => {
    const latestConference = konferenzes[0];
    if (!latestConference?.slug?.current) return;
    gsap.to(document.querySelector(".gallery"), {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        router.push(`/konferenz/${latestConference.slug.current}`);
      },
    });
  };

  return (
    <MainLayout>
      <section id="poster-frame" onClick={goToKonf} style={{ opacity: 1 }}>
        <Poster data={poster} />
      </section>
    </MainLayout>
  );
}

export async function getStaticProps() {
  const konferenzes = await client.fetch(`
     *[_type == "konferenz" && defined(slug.current)] {
      slug,
      menuTitle,
      pageTitle,
      "firstProgramDate": program.days[0].date
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
      konferenzes: konferenzes.sort(newestConferenceFirst),
      poster,
    },
    revalidate: 60, // Revalidate every minute
  };
}
