import React, { useEffect, useRef, useContext } from "react";
import { MainLayout } from "/components/MainLayout";
import Menu from "/components/Menu";
import client from "/client";
import { menuItemsQuery } from "/sanityQueries";
import RandomImage from "/components/RandomImage";
import Image from "next/image";
import Slogan from "/components/Slogan";
import Footer from "/components/Footer";
import { PortableText } from "@portabletext/react";
import Overlay from "/components/Overlay";
import { OverlaysContext } from "/contexts/OverlaysContext";
import showAfterLoad from "/components/showAfterLoad";
import useWindowDimensions from "/components/useWindowDimensions";
import VideoEmbed from "/components/VideoEmbed";
import { MenuContext } from "/contexts/MenuContext";
import gsap from "gsap";
import { useRouter } from "next/router";
import OverflowPortableText from "/components/overflowPortableText";
import Modal from "react-modal";
import checkBack from "/components/checkBack";
import Fotoarchiv from "/components/Fotoarchiv";
import { FotoarchivContext } from "/contexts/FotoarchivContext";
import SanityPreviewFallback, { SanityPreviewValue, shouldShowSanityPreviewFallback, hasSanityValue } from "/components/SanityPreviewFallback";

Modal.setAppElement("#__next");

// export async function getServerSideProps() {
//   const fotos = await client.fetch(`*[_type == "photo"] | order(orderRank asc)`);
//   return { props: { fotos } };
// }

export default function Konferenz({ konferenz, menuItems, fotoarchiv }) {
  const { overlays, storeOverlays, resetOverlays, closeEvent, storeCloseEvent, openEvent, storeOpenEvent } =
    useContext(OverlaysContext);
  const { opened, storeOpened } = useContext(MenuContext);
  const { fotoarchivState, storeFotoarchivState } = useContext(FotoarchivContext);
  const progAnchorRef = useRef();
  const amPodAnchorRef = useRef();

  const { width, height } = useWindowDimensions();

  const router = useRouter();

  useEffect(() => {
    document.body.style.background = getComputedStyle(document.querySelector(":root")).getPropertyValue("--color_white");
  }, []);

  showAfterLoad({ scrollToTop: "true" });

  const registerOverlays = () => {
    storeOverlays([
      {
        ref: "program",
        // anchorY: progAnchorRef.current.offsetTop - 18,
        show: false,
      },
      {
        ref: "am-podium",
        // anchorY: amPodAnchorRef.current.offsetTop - 18,
        show: false,
      },
      {
        ref: "fotoarchiv",
        show: false,
      },
    ]);
  };

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
      }),
    );
    storeOpenEvent(true);

    storeCloseEvent(false);
    router.push(`/konferenz/${currentSlug}?modal=${ref}`, undefined, { shallow: true, scroll: false });
  };

  const handleNavigation = (path) => {
    gsap.to([document.querySelector(".page"), document.querySelector("nav"), document.querySelector("#am-podium")], {
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
          }),
        );
      },
    });
  };

  const linksBlank = {
    marks: {
      link: ({ children, value }) => {
        return (
          <a href={value.href} rel="noreferrer noopener" target="_blank">
            {children}
          </a>
        );
      },
    },
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

  if (shouldShowSanityPreviewFallback(konferenz, menuItems, fotoarchiv)) {
    return (
      <MainLayout>
        <SanityPreviewFallback />
      </MainLayout>
    );
  }

  const currentSlug = konferenz.slug?.current || router.query.slug;
  const topImages = Array.isArray(konferenz.topImages)
    ? konferenz.topImages.filter((image) => image?.url && image?.blurDataURL?.metadata?.lqip)
    : [];
  const programDays = Array.isArray(konferenz.program?.days) ? konferenz.program.days.filter(Boolean) : [];
  const amPodium = Array.isArray(konferenz.amPodium) ? konferenz.amPodium : [];
  const bottomMedia = konferenz.bottomMedia || {};
  const bottomImage = bottomMedia.bottomImage || {};
  const hasBottomPhoto = bottomMedia.selectedMedia === "photo" && bottomImage.url && bottomImage.blurDataURL?.metadata?.lqip;
  const hasBottomVideo = bottomMedia.selectedMedia === "embedVideo" && bottomMedia.embedVideo?.url;
  const importantBlocks = Array.isArray(konferenz.importantBlocks?.block)
    ? konferenz.importantBlocks.block.filter(Boolean)
    : [];
  const currentFotoarchivIndex = fotoarchiv?.konferenz?.findIndex((k) => k?.slug?.current === currentSlug) ?? -1;
  const currentFotoarchiv = currentFotoarchivIndex >= 0 ? fotoarchiv.konferenz[currentFotoarchivIndex] : null;

  programDays.forEach((dayObj) => {
    if (dayObj?.date) {
      const date = new Date(dayObj.date);
      const day = date.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "");
      const dayAndMonth = date.toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long",
      });
      dayObj.formattedDate = `${day}: ${dayAndMonth}`;
    }
  });

  return (
    <MainLayout>
      <section id="konferenz" className="page" style={{ opacity: 0 }}>
        {(hasSanityValue(konferenz.pageTitle) ||
          hasSanityValue(konferenz.pageTitleMobile) ||
          topImages[0]?.url ||
          hasSanityValue(konferenz.description)) && (
          <div className="uniblock">
            <div className="uniblock-title">
              <h1 className="scalable-first">
                <a className="no-underline" onClick={() => handleNavigation("/")}>
                  <span style={{ letterSpacing: "-0.06em" }}>©</span>
                </a>
                {width < 576 ? <br /> : ` `}
                {width > 576 ? (
                  <SanityPreviewValue value={konferenz.pageTitle} fieldTitle="Page title" />
                ) : (
                  <SanityPreviewValue value={konferenz.pageTitleMobile || konferenz.pageTitle} fieldTitle="Page title mobile" />
                )}
              </h1>
            </div>
            <div className="uniblock-image">
              {topImages[0]?.url ? (
                <RandomImage id={konferenz.menuTitle || currentSlug} slug={currentSlug} data={topImages} />
              ) : (
                <SanityPreviewFallback fieldTitle="Top images" />
              )}
            </div>
            {width > 992 ? (
              <div className="uniblock-text">
                {hasSanityValue(konferenz.description) ? (
                  <PortableText value={konferenz.description} components={linksBlank} />
                ) : (
                  <SanityPreviewFallback fieldTitle="Description" />
                )}
              </div>
            ) : (
              <>
                {hasSanityValue(konferenz.description) ? (
                  <OverflowPortableText value={konferenz.description} components={linksBlank} />
                ) : (
                  <SanityPreviewFallback fieldTitle="Description" />
                )}
              </>
            )}
          </div>
        )}
        {(hasSanityValue(konferenz.topic) ||
          programDays[0] ||
          amPodium[0] ||
          currentFotoarchiv?.fotoarchiv?.length > 0 ||
          hasBottomPhoto ||
          hasBottomVideo ||
          importantBlocks[0]) && (
          <div className="block">
            <div className="block-title">
              <h1 className="scalable">
                <SanityPreviewValue value={konferenz.topic} fieldTitle="Topic" />
              </h1>
              {programDays[0] && (
                <h1 className="scalable" ref={progAnchorRef}>
                  {programDays.length > 1 ? (
                    <>
                      {programDays.map((d, index) => (
                        <React.Fragment key={index}>
                          <a onClick={() => openOverlay("program", index)}>T. {index + 1}</a>
                          {index < programDays.length - 1 && ", "}
                        </React.Fragment>
                      ))}
                      <span>&nbsp;Programm</span>
                    </>
                  ) : (
                    <a onClick={() => openOverlay("program", programDays[0])}>Programm</a>
                  )}
                </h1>
              )}
              {amPodium[0] &&
                (currentSlug === "2--jahreskonferenz" ? (
                  <h1 className="scalable">Redner:innen</h1>
                ) : (
                  <h1 className="scalable" ref={amPodAnchorRef}>
                    <a onClick={() => openOverlay("am-podium")}>Redner:innen</a>
                  </h1>
                ))}
              {currentFotoarchiv?.fotoarchiv?.length > 0 ? (
                <h1 className="scalable">
                  <a
                    onClick={() => {
                      openOverlay("fotoarchiv");
                      storeFotoarchivState((prev) => ({
                        ...prev,
                        mode: "grid",
                        part: "konferenz",
                        id: currentFotoarchivIndex,
                        folder: 0,
                        slide: 0,
                      }));
                    }}
                  >
                    Fotoarchiv
                  </a>
                </h1>
              ) : null}
            </div>
            <div className="block-image link-on-top-x">
              {hasBottomPhoto && (
                  <Image
                    src={`${bottomImage.url}?dpr=1`}
                    srcSet={`${bottomImage.url}?dpr=2 2x`}
                    placeholder="blur"
                    blurDataURL={bottomImage.blurDataURL.metadata.lqip}
                    width={bottomImage.width}
                    height={bottomImage.height}
                    sizes="auto"
                    priority
                    // {...useNextImageFade('')}
                  />
                )}
              {hasBottomVideo && <VideoEmbed url={bottomMedia.embedVideo.url} presse={false} />}
            </div>
            <div className="block-text col-2">
              {importantBlocks[0] &&
                importantBlocks.map((b, index) => (
                  <div className="important-block" key={index}>
                    <p className="important-block-title">
                      <SanityPreviewValue value={b?.title} fieldTitle="Important block title" />
                    </p>
                    {hasSanityValue(b?.description) ? (
                      <PortableText value={b.description} components={linksBlank} />
                    ) : (
                      <SanityPreviewFallback fieldTitle="Important block description" />
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
        <Slogan
          firstPhrase={{ intro: "Wir schätzen", accent: "Kultur" }}
          secondPhrase={{ intro: "Wir schützen", accent: "Leistungen" }}
          thirdPhrase={{ intro: "Wir vertreten", accent: "Rechte" }}
        />
        <Footer />
      </section>

      {/* PROGRAM */}
      <Modal
        isOpen={
          overlays.find((overlay) => overlay.ref === "program") && overlays.find((overlay) => overlay.ref === "program").show
        }
        onRequestClose={() =>
          router.push(`/konferenz/${currentSlug}`, undefined, {
            shallow: true,
            scroll: false,
          })
        }
        style={modalStyle}
      >
        <Overlay id="program" toolbarDownload={konferenz.programFile?.url || ""}>
          {programDays.length > 0 &&
            programDays.map((day, index) => (
              <React.Fragment key={index}>
                <div className="overlay-content-title">
                  <h1 data-index={index} style={{ maxWidth: "90%" }}>
                    <SanityPreviewValue value={day.formattedDate} fieldTitle="Program day date" />
                  </h1>
                </div>
                <div className="overlay-content-body">
                  {day?.partOfDays?.partofDay?.length > 0 &&
                    day.partOfDays.partofDay.filter(Boolean).map((pd, j) => (
                      <div className="part-of-day" key={index}>
                        <div className="part-of-day-title">
                          <p>
                            <SanityPreviewValue value={pd?.title} fieldTitle="Part of day title" />
                          </p>
                        </div>
                        <div className="part-of-day-content">
                          {pd?.events?.event?.length > 0 &&
                            pd.events.event.filter(Boolean).map((e, index) => (
                              <div className="event" key={index}>
                                <div className="event-info">
                                  <h3>
                                    <SanityPreviewValue value={e?.info} fieldTitle="Event info" />
                                  </h3>
                                </div>
                                <div className="event-title">
                                  <h4>
                                    {hasSanityValue(e?.eventTitle) ? (
                                      <PortableText value={e.eventTitle} components={linksBlank} />
                                    ) : (
                                      <SanityPreviewFallback fieldTitle="Event title" />
                                    )}
                                  </h4>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </React.Fragment>
            ))}
        </Overlay>
      </Modal>

      {/* AM PODIUM */}
      <Modal
        isOpen={
          overlays.find((overlay) => overlay.ref === "am-podium") &&
          overlays.find((overlay) => overlay.ref === "am-podium").show
        }
        onRequestClose={() =>
          router.push(`/konferenz/${currentSlug}`, undefined, {
            shallow: true,
            scroll: false,
          })
        }
        style={modalStyle}
      >
        <Overlay id="am-podium">
          <div className="overlay-content-title">
            <h1>
              <span style={{ letterSpacing: "-0.06em" }}>
                <a onClick={() => handleNavigation("/")} className="no-underline white">
                  ©
                </a>
                {width < 576 && <br />}
              </span>{" "}
              Redner:innen
            </h1>
          </div>
          <div className="overlay-content-body">
            <div className="col-2-grid">
              {amPodium.length > 0 &&
                amPodium.map((a, index) => (
                  <React.Fragment key={index}>
                    {a ? (
                      <div className="person">
                        <div className="person-title">
                          <h3>
                            <SanityPreviewValue value={a.name} fieldTitle="Name" /> <br />{" "}
                            <SanityPreviewValue value={a.regalia} fieldTitle="Regalia" />
                          </h3>
                        </div>
                        <div className="person-photo">
                          {a.imageUrl && a.blurDataURL?.metadata?.lqip && (
                            <Image
                              src={`${a.imageUrl}?dpr=1`}
                              srcSet={`${a.imageUrl}?dpr=2 2x`}
                              placeholder="blur"
                              blurDataURL={a.blurDataURL.metadata.lqip}
                              width="0"
                              height="0"
                              sizes="auto"
                              priority
                            />
                          )}
                        </div>
                        <div className="person-about">
                          <h3>
                            {hasSanityValue(a.about) ? (
                              <PortableText value={a.about} components={linksBlank} />
                            ) : (
                              <SanityPreviewFallback fieldTitle="About" />
                            )}
                          </h3>
                        </div>
                      </div>
                    ) : (
                      <SanityPreviewFallback className="person" fieldTitle="Am Podium reference" />
                    )}
                    {width >= 768 && index % 4 === 3 && (
                      <>
                        <div></div>
                        <div className="divider"></div>
                      </>
                    )}
                  </React.Fragment>
                ))}
            </div>
          </div>
        </Overlay>
      </Modal>

      {/* FOTOARCHIV */}
      <Modal
        isOpen={
          overlays.find((overlay) => overlay.ref === "fotoarchiv") &&
          overlays.find((overlay) => overlay.ref === "fotoarchiv").show
        }
        onRequestClose={() =>
          router.push(`/konferenz/${currentSlug}`, undefined, {
            shallow: true,
            scroll: false,
          })
        }
        style={modalStyle}
      >
        <Overlay id="fotoarchiv">
          <div className="overlay-content-title">
            <h1>
              <span style={{ letterSpacing: "-0.06em" }}>
                <a onClick={() => handleNavigation("/")} className="no-underline white">
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

export async function getStaticPaths() {
  const paths = await client.fetch(`
        *[_type == "konferenz" && defined(slug.current)] {
            "params": { "slug": slug.current }
        }
    `);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const konferenz = await client.fetch(
    `
      *[_type == "konferenz" && slug.current == $slug][0] {
        _id,
        menuTitle,
        pageTitle,
        slug,
        pageTitleMobile,
        topImages[] {
            "width": asset->metadata.dimensions.width,
            "height": asset->metadata.dimensions.height,
            "url": asset->url,
            "blurDataURL": asset->{
                metadata {
                  lqip
                }
              }
        },
        description,
        topic,
        program,
        programFile {
            "url": asset->url,
        },
        amPodium[]-> {
            name,
            regalia,
            about,
            "imageUrl": image.asset->url,
            "blurDataURL": image.asset->{
                metadata {
                    lqip
                }
            }
        },
        bottomMedia {
            selectedMedia,
            bottomImage {
                "width": asset->metadata.dimensions.width,
                "height": asset->metadata.dimensions.height,
                "url": asset->url,
                "blurDataURL": asset->{
                    metadata {
                      lqip
                    }
                }
            },
            embedVideo {
                url
            }
        },
        importantBlocks
      }
    `,
    { slug: params.slug },
  );

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

  const menuItems = await client.fetch(menuItemsQuery);

  return {
    props: {
      konferenz,
      menuItems,
      fotoarchiv,
    },
    revalidate: 60, // Revalidate every minute
  };
}
