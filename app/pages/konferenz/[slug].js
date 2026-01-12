import React, { useEffect, useRef, useContext } from "react";
import { MainLayout } from "/components/MainLayout";
import Menu from "/components/Menu";
import client from "/sanityClient";
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

Modal.setAppElement("#__next");

export default function Konferenz({ konferenz, menuItems, fotoarchiv }) {
  const {
    overlays,
    storeOverlays,
    resetOverlays,
    closeEvent,
    storeCloseEvent,
    openEvent,
    storeOpenEvent,
  } = useContext(OverlaysContext);
  const { opened, storeOpened } = useContext(MenuContext);
  const { fotoarchivState, storeFotoarchivState } =
    useContext(FotoarchivContext);
  const progAnchorRef = useRef();
  const amPodAnchorRef = useRef();

  const { width, height } = useWindowDimensions();

  const router = useRouter();

  useEffect(() => {
    document.body.style.background = getComputedStyle(
      document.querySelector(":root")
    ).getPropertyValue("--color_white");
  }, []);

  // Change date format
  if (konferenz.program && konferenz.program.days) {
    konferenz.program.days.forEach((dayObj) => {
      if (dayObj.date) {
        const date = new Date(dayObj.date);
        const day = date
          .toLocaleDateString("de-DE", { weekday: "short" })
          .replace(".", "");
        const dayAndMonth = date.toLocaleDateString("de-DE", {
          day: "numeric",
          month: "long",
        });
        dayObj.formattedDate = `${day}: ${dayAndMonth}`;
      }
    });
  }

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
      })
    );
    storeOpenEvent(true);

    storeCloseEvent(false);
    router.push(
      `/konferenz/${konferenz.slug.current}?modal=${ref}`,
      undefined,
      { shallow: true, scroll: false }
    );
  };

  const handleNavigation = (path) => {
    gsap.to(
      [
        document.querySelector(".page"),
        document.querySelector("nav"),
        document.querySelector("#am-podium"),
      ],
      {
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
      }
    );
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

  return (
    <MainLayout>
      <section id="konferenz" className="page" style={{ opacity: 0 }}>
        {konferenz.pageTitle && (
          <div className="uniblock">
            <div className="uniblock-title">
              <h1 className="scalable-first">
                <a
                  className="no-underline"
                  onClick={() => handleNavigation("/")}
                >
                  <span style={{ letterSpacing: "-0.06em" }}>©</span>
                </a>
                {width < 576 ? <br /> : ` `}
                {width > 576 ? konferenz.pageTitle : konferenz.pageTitleMobile}
              </h1>
            </div>
            <div className="uniblock-image">
              {konferenz.topImages[0].url && (
                <RandomImage
                  id={konferenz.menuTitle}
                  slug={konferenz.slug.current}
                  data={konferenz.topImages}
                />
              )}
            </div>
            {width > 992 ? (
              <div className="uniblock-text">
                <PortableText
                  value={konferenz.description}
                  components={linksBlank}
                />
              </div>
            ) : (
              <OverflowPortableText
                value={konferenz.description}
                components={linksBlank}
              />
            )}
          </div>
        )}
        {konferenz.topic && (
          <div className="block">
            <div className="block-title">
              <h1 className="scalable">{konferenz.topic}</h1>
              {konferenz.program && konferenz.program.days[0] && (
                <h1 className="scalable" ref={progAnchorRef}>
                  {konferenz.program.days.length > 1 ? (
                    <>
                      {konferenz.program.days.map((d, index) => (
                        <React.Fragment key={index}>
                          <a onClick={() => openOverlay("program", index)}>
                            T. {index + 1}
                          </a>
                          {index < konferenz.program.days.length - 1 && ", "}
                        </React.Fragment>
                      ))}
                      <span>&nbsp;Programm</span>
                    </>
                  ) : (
                    <a
                      onClick={() =>
                        openOverlay("program", konferenz.program.days[0])
                      }
                    >
                      Programm
                    </a>
                  )}
                </h1>
              )}
              {konferenz.amPodium &&
                (konferenz.slug.current === "2--jahreskonferenz" ? (
                  <h1 className="scalable">Redner:innen</h1>
                ) : (
                  <h1 className="scalable" ref={amPodAnchorRef}>
                    <a onClick={() => openOverlay("am-podium")}>Redner:innen</a>
                  </h1>
                ))}
              {fotoarchiv.konferenz?.filter(
                (f) => f.slug.current === konferenz.slug.current
              )[0].fotoarchiv?.length > 0 ? (
                <h1 className="scalable">
                  <a
                    onClick={() => {
                      openOverlay("fotoarchiv");
                      storeFotoarchivState((prev) => ({
                        ...prev,
                        mode: "grid",
                        part: "konferenz",
                        id: fotoarchiv.konferenz.findIndex(
                          (k) => k.slug.current === konferenz.slug.current
                        ),
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
              {konferenz.bottomMedia &&
                konferenz.bottomMedia.selectedMedia === "photo" &&
                konferenz.bottomMedia.bottomImage.url && (
                  <Image
                    src={`${konferenz.bottomMedia.bottomImage.url}?dpr=1`}
                    srcSet={`${konferenz.bottomMedia.bottomImage.url}?dpr=2 2x`}
                    placeholder="blur"
                    blurDataURL={
                      konferenz.bottomMedia.bottomImage.blurDataURL.metadata
                        .lqip
                    }
                    width={konferenz.bottomMedia.bottomImage.width}
                    height={konferenz.bottomMedia.bottomImage.height}
                    sizes="auto"
                    priority
                    // {...useNextImageFade('')}
                  />
                )}
              {konferenz.bottomMedia &&
                konferenz.bottomMedia.selectedMedia === "embedVideo" &&
                konferenz.bottomMedia.embedVideo.url && (
                  <VideoEmbed
                    url={konferenz.bottomMedia.embedVideo.url}
                    presse={false}
                  />
                )}
            </div>
            <div className="block-text col-2">
              {konferenz.importantBlocks &&
                konferenz.importantBlocks.block.map((b, index) => (
                  <div className="important-block" key={index}>
                    <p className="important-block-title">{b.title}</p>
                    <PortableText
                      value={b.description}
                      components={linksBlank}
                    />
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
          overlays.find((overlay) => overlay.ref === "program") &&
          overlays.find((overlay) => overlay.ref === "program").show
        }
        onRequestClose={() =>
          router.push(`/konferenz/${konferenz.slug.current}`, undefined, {
            shallow: true,
            scroll: false,
          })
        }
        style={modalStyle}
      >
        <Overlay
          id="program"
          toolbarDownload={konferenz.programFile?.url || ""}
        >
          {konferenz.program.days?.length > 0 &&
            konferenz.program.days.map((day, index) => (
              <React.Fragment key={index}>
                <div className="overlay-content-title">
                  <h1 data-index={index} style={{ maxWidth: "90%" }}>
                    {day.formattedDate}
                  </h1>
                </div>
                <div className="overlay-content-body">
                  {day.partOfDays?.partofDay?.length > 0 &&
                    day.partOfDays.partofDay.map((pd, j) => (
                      <div className="part-of-day" key={index}>
                        <div className="part-of-day-title">
                          <p>{pd.title}</p>
                        </div>
                        <div className="part-of-day-content">
                          {pd.events?.event?.length > 0 &&
                            pd.events.event.map((e, index) => (
                              <div className="event" key={index}>
                                <div className="event-info">
                                  <h3>{e.info}</h3>
                                </div>
                                <div className="event-title">
                                  <h4>
                                    <PortableText
                                      value={e.eventTitle}
                                      components={linksBlank}
                                    />
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
          router.push(`/konferenz/${konferenz.slug.current}`, undefined, {
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
                <a
                  onClick={() => handleNavigation("/")}
                  className="no-underline white"
                >
                  ©
                </a>
                {width < 576 && <br />}
              </span>{" "}
              Redner:innen
            </h1>
          </div>
          <div className="overlay-content-body">
            <div className="col-2-grid">
              {konferenz.amPodium &&
                konferenz.amPodium.map((a, index) => (
                  <React.Fragment key={index}>
                    <div className="person">
                      <div className="person-title">
                        <h3>
                          {a.name} <br /> {a.regalia}
                        </h3>
                      </div>
                      <div className="person-photo">
                        {a.imageUrl && (
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
                          <PortableText
                            value={a.about}
                            components={linksBlank}
                          />
                        </h3>
                      </div>
                    </div>
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
          router.push(`/konferenz/${konferenz.slug.current}`, undefined, {
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
    { slug: params.slug }
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

  const menuItems = await client.fetch(`
      *[defined(menuTitle) && id != "datenschutz" && id != null] | order(order asc) {
        id,
        menuTitle,
        slug
      }
    `);

  return {
    props: {
      konferenz,
      menuItems,
      fotoarchiv,
    },
    revalidate: 3600, // Revalidate every hour (was 1 second - too aggressive)
  };
}
