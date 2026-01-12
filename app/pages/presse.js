import { MainLayout } from "../components/MainLayout";
import React, { useEffect, useRef, useState, useContext } from "react";
import { gsap } from "gsap/dist/gsap";
import Menu from "../components/Menu";
import client from "../sanityClient";
import showAfterLoad from "../components/showAfterLoad";
import { format } from "date-fns";
import { isPast, parseISO } from "date-fns";
import PostToolbar from "../components/PostToolbar";
import Post from "../components/Post";
import showWhenInView from "../components/showWhenInView";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import useWindowDimensions from "../components/useWindowDimensions";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import { useRouter } from "next/router";
import { OverlaysContext } from "../contexts/OverlaysContext";
import InversePost from "../components/InversePost";
import Modal from "react-modal";
import Overlay from "/components/Overlay";
import checkBack from "/components/checkBack";
import Fotoarchiv from "../components/Fotoarchiv";

export default function Presse({ presse, menuItems, anchors, fotoarchiv }) {
  const {
    overlays,
    storeOverlays,
    resetOverlays,
    closeEvent,
    storeCloseEvent,
    openEvent,
    storeOpenEvent,
  } = useContext(OverlaysContext);
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  showAfterLoad({ showIn: "false" });

  useEffect(() => {
  }, []);

  gsap.registerPlugin(ScrollToPlugin);

  function scrollTo(y) {
    gsap.to(window, {
      scrollTo: y,
      duration: 1,
      ease: "power1.inOut",
    });
  }

  const handleNavigation = (path) => {
    gsap.to([document.querySelector(".page"), document.querySelector("nav")], {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        router.push(path);
        storeOpenEvent(false);
        storeCloseEvent(true);
        storeOverlays((prev) =>
          prev.map((overlay) => {
            return {
              ...overlay,
              show: false,
            };
          })
        );
      },
    });
  };

  useEffect(() => {
    document.body.style.background = getComputedStyle(
      document.querySelector(":root")
    ).getPropertyValue("--color_white");

    gsap.registerPlugin(ScrollTrigger);
    const ps = [...document.querySelectorAll(".presse-posts-post p")];
    ps.forEach((item, i) => {
      const anim = gsap.fromTo(
        item,
        {
          autoAlpha: 1,
          scale: 0.95,
          transformOrigin: "0 0",
        },
        {
          duration: 0.7,
          autoAlpha: 1,
          scale: 1,
        }
      );

      ScrollTrigger.create({
        trigger: item,
        animation: anim,
        toggleActions: "play none none none",
        once: true,
      });
    });
  }, []);

  useEffect(() => {
    resetOverlays();
    registerOverlays();
  }, []);

  useEffect(() => {
    if (closeEvent) {
      resetOverlays();
      registerOverlays(() => storeCloseEvent(false));
    }
  }, [closeEvent]);

  const openOverlay = (ref, i) => {
    storeOverlays((prev) =>
      prev.map((overlay) => {
        if (overlay.ref === ref) {
          return {
            ...overlay,
            show: true,
            ...(i !== undefined && { i }),
          };
        }
        return overlay;
      })
    );
    storeOpenEvent(true);

    storeCloseEvent(false);
    router.push(`/presse?modal=${ref}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const registerOverlays = () => {
    storeOverlays([
      {
        ref: "fotoarchiv",
        show: false,
      },
    ]);
  };

  const modalStyle = {
    content: {
      width: "100%",
      height: "100%",
      inset: 0,
      border: 0,
      background: "transparent",
      borderRadius: 0,
      padding: 0,
      zIndex: 9999,
    },
  };

  checkBack();

  return (
    <MainLayout>
      <section className="presse page" style={{ opacity: 0 }}>
        <div className="presse-title">
          <h1>
            <span style={{ letterSpacing: "-0.06em" }}>
              <a onClick={() => handleNavigation("/")} className="no-underline">
                ©
              </a>
              {width < 576 && <br />}
            </span>
          </h1>
          <section className="toolbar-presse">
            {width >= 1366 && anchors && (
              <div className="toolbar-anchors">
                {anchors.map((a, i) =>
                  a.map((anchor, index) => (
                    <a
                      key={index}
                      onClick={() => {
                        scrollTo(
                          document.querySelector(`[data-index*="${anchor}"]`)
                            .offsetTop + 1
                        );
                      }}
                    >
                      <h3>{anchor}</h3>
                    </a>
                  ))
                )}
              </div>
            )}
          </section>
        </div>
        <div className="presse-posts">
          {presse.posts.map((p, index) =>
            !p.inverse ? (
              <Post data={p} key={index} />
            ) : (
              <InversePost data={p} key={index} openModal={openOverlay} />
            )
          )}
        </div>
      </section>

      {/* FOTOARCHIV */}
      <Modal
        isOpen={
          overlays.find((overlay) => overlay.ref === "fotoarchiv") &&
          overlays.find((overlay) => overlay.ref === "fotoarchiv").show
        }
        onRequestClose={() =>
          router.push("/presse", undefined, { shallow: true, scroll: false })
        }
        style={modalStyle}
      >
        <Overlay id="fotoarchiv">
          <div className="overlay-content-title">
            <h1>
              <span style={{ letterSpacing: "-0.06em" }}>
                <a
                  onClick={() => handleNavigation("/")}
                  className="no-underline white"
                >
                  ©
                </a>
                {width < 576 && <br />}
              </span>{" "}
              <span className="overlay-content-title-span">Fotos</span>
            </h1>
          </div>
          <div className="overlay-content-body">
            <Fotoarchiv src={fotoarchiv} />
          </div>
        </Overlay>
      </Modal>

      <Menu data={menuItems} />
    </MainLayout>
  );
}

export async function getStaticProps() {
  const [presse] = await client.fetch(`
  *[_type == "presse"] {
    posts[] {
      archive,
      inverse,
      anchors[],
      media {
        selectedMedia,
        photos {
          images[]{
            "url": asset->url,
            "blurDataURL": asset->metadata.lqip
          }
        },
        embedVideo {
          url
        }
      },
      title,
      file {
        "url": asset->url,
      },
      filename
    },
  }
  `);

  const fotoarchiv = await client.fetch(`
    {
      "konferenz": *[_type == "konferenz"] {
        menuTitle,
        slug,
        fotoarchiv[] {
          _key,
          title,
          credits,
          images[] {
            _key,
            caption,
            image {
              _key,
              "width": asset->metadata.dimensions.width,
              "height": asset->metadata.dimensions.height,
              "url": asset->url,
              "blurDataURL": asset->metadata.lqip
            }
          }
        }
      },
      "presse": *[_type == "presse"].fotoarchiv[] {
        _key,
        menuTitle,
        fotoarchiv[] {
            _key,
            title,
            credits,
            images[] {
            _key,
            caption,
            image {
                _key,
                "width": asset->metadata.dimensions.width,
                "height": asset->metadata.dimensions.height,
                "url": asset->url,
                "blurDataURL": asset->metadata.lqip
            }
            }
        }
      }
    }
  `);

  const menuItems = await client.fetch(`
    *[defined(menuTitle) && id != "datenschutz" && id != null] | order(order asc) {
      id,
      menuTitle,
      slug
    }
  `);

  const anchorsArray = [];
  presse.posts.forEach((post) => {
    if (post.anchors) {
      anchorsArray.push(post.anchors);
    }
  });

  return {
    props: {
      presse,
      menuItems,
      anchors: anchorsArray,
      fotoarchiv,
    },
    revalidate: 3600, // Revalidate every hour
  };
}
