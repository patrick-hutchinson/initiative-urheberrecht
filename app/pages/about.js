import { MainLayout } from "../components/MainLayout";
import React, { useEffect, useRef, useState, useContext } from "react";
import { gsap } from "gsap/dist/gsap";
import Menu from "../components/Menu";
import client from "../sanityClient";
import RandomImage from "../components/RandomImage";
import Image from "next/image";
import Slogan from "../components/Slogan";
import Footer from "../components/Footer";
import { PortableText } from "@portabletext/react";
import Overlay from "../components/Overlay";
import { OverlaysContext } from "../contexts/OverlaysContext";
import showAfterLoad from "../components/showAfterLoad";
import useWindowDimensions from "../components/useWindowDimensions";
import { useRouter } from "next/router";
import OverflowPortableText from "../components/overflowPortableText";
import Modal from "react-modal";
import checkBack from "../components/checkBack";

Modal.setAppElement("#__next");

export default function About({ about, menuItems }) {
  const {
    overlays,
    storeOverlays,
    resetOverlays,
    closeEvent,
    storeCloseEvent,
    openEvent,
    storeOpenEvent,
  } = useContext(OverlaysContext);
  const tatAnchorRef = useRef();
  const vorAnchorRef = useRef();

  const { width, height } = useWindowDimensions();

  const router = useRouter();

  useEffect(() => {
    document.body.style.background = getComputedStyle(
      document.querySelector(":root")
    ).getPropertyValue("--color_white");
  }, []);

  showAfterLoad();

  const registerOverlays = () => {
    storeOverlays([
      {
        ref: "tatigkeiten",
        // anchorY: tatAnchorRef.current.offsetTop - 18,
        show: false,
      },
    ]);
  };

  useEffect(() => {
    // localStorage.clear()
    resetOverlays();
    registerOverlays();

    // resizeListener(registerOverlays)
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

    router.push(`/about?modal=${ref}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const greyComp = {
    block: ({ children }) => <p className="grey">{children}</p>,
    marks: {
      link: ({ children, value }) => {
        const rel = !value.href.startsWith("/")
          ? "noreferrer noopener"
          : undefined;
        return (
          <a href={value.href} rel={rel} target="_blank">
            {children}
          </a>
        );
      },
    },
  };

  const linksBlank = {
    marks: {
      link: ({ children, value }) => {
        const rel = !value.href.startsWith("/")
          ? "noreferrer noopener"
          : undefined;
        return (
          <a href={value.href} rel={rel} target="_blank">
            {children}
          </a>
        );
      },
    },
  };

  const handleNavigation = (path) => {
    gsap.to(
      [
        document.querySelector(".page"),
        document.querySelector("nav"),
        document.querySelector("#tatigkeiten"),
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
      <section id="about" className="page" style={{ opacity: 0 }}>
        {about.pageTitle && (
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
                {about.pageTitle}
              </h1>
            </div>
            <div className="uniblock-image">
              {about.topImages[0].url && (
                <RandomImage id={about.menuTitle} data={about.topImages} />
              )}
            </div>

            {width > 992 ? (
              <div className="uniblock-text">
                <PortableText
                  value={about.description}
                  components={linksBlank}
                />
              </div>
            ) : (
              <OverflowPortableText
                value={about.description}
                components={linksBlank}
              />
            )}
          </div>
        )}
        {about.chronikTitle && (
          <div className="uniblock">
            <div className="uniblock-title">
              <h1 className="scalable">{about.chronikTitle}</h1>
            </div>
            <div className="uniblock-image">
              {about.chronikImage[0].url && (
                <RandomImage
                  id={about.menuTitle + "2"}
                  data={about.chronikImage}
                />
              )}
            </div>
            {width > 992 ? (
              <div className="uniblock-text">
                <PortableText
                  value={about.chronikText}
                  components={linksBlank}
                />
              </div>
            ) : (
              <OverflowPortableText
                value={about.chronikText}
                components={linksBlank}
              />
            )}
          </div>
        )}
        {about.bereicheTitle && (
          <div className="uniblock">
            <div className="uniblock-title">
              <h1 className="scalable over">{about.bereicheTitle}</h1>
            </div>
            <div className="uniblock-image">
              {about.bereicheImage[0].url && (
                <RandomImage
                  id={about.menuTitle + "3"}
                  data={about.bereicheImage}
                />
              )}
            </div>
            {width > 992 ? (
              <div className="uniblock-text">
                <PortableText
                  value={about.bereicheText}
                  components={linksBlank}
                />
              </div>
            ) : (
              <OverflowPortableText
                value={about.bereicheText}
                components={linksBlank}
              />
            )}
          </div>
        )}
        {about.statuten && (
          <div className="uniblock">
            <div className="uniblock-title">
              <h1 ref={tatAnchorRef} className="scalable">
                <a onClick={() => openOverlay("tatigkeiten")}>
                  <span style={{ letterSpacing: "-0.09em" }}>T</span>ätigkeiten
                </a>
              </h1>
              <h1 ref={vorAnchorRef} className="scalable">
                <a onClick={() => openOverlay("tatigkeiten", 1)}>Vorstand</a>
              </h1>
              <h1 className="scalable">
                <a href={about.statuten.url} target="_blank">
                  Statuten
                </a>
              </h1>
            </div>
            <div className="uniblock-image link-on-top-x">
              {about.statutenImage[0].url && (
                <RandomImage
                  id={about.menuTitle + "4"}
                  data={about.statutenImage}
                />
              )}
            </div>

            {width > 992 ? (
              <div className="uniblock-text">
                <PortableText
                  value={about.statutenText}
                  components={linksBlank}
                />
              </div>
            ) : (
              <OverflowPortableText
                value={about.statutenText}
                components={linksBlank}
              />
            )}
          </div>
        )}
        {about.tatigkeiten && (
          <div className="uniblock ">
            <div className="uniblock-title">
              <h1 className="scalable">Zielgruppen und Ansprechpersonen</h1>
            </div>
            <div className="uniblock-image link-on-top-x">
              {about.tatigkeitenImage[0].url && (
                <RandomImage
                  id={about.menuTitle + "5"}
                  data={about.tatigkeitenImage}
                />
              )}
            </div>

            {width > 992 ? (
              <div className="uniblock-text">
                <PortableText
                  value={about.tatigkeitenText}
                  components={linksBlank}
                />
              </div>
            ) : (
              <OverflowPortableText
                value={about.tatigkeitenText}
                components={linksBlank}
              />
            )}
          </div>
        )}
        <Slogan
          firstPhrase={{ intro: "Wir schätzen", accent: "Kreative" }}
          secondPhrase={{ intro: "Wir schützen", accent: "Kunst" }}
          thirdPhrase={{ intro: "Wir vertreten", accent: "Interessen" }}
        />
        <Footer />
      </section>

      {/* TATIGKEITEN */}
      <Modal
        isOpen={
          overlays.find((overlay) => overlay.ref === "tatigkeiten") &&
          overlays.find((overlay) => overlay.ref === "tatigkeiten").show
        }
        onRequestClose={() =>
          router.push("/about", undefined, { shallow: true, scroll: false })
        }
        style={modalStyle}
      >
        <Overlay id="tatigkeiten">
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
              <span style={{ letterSpacing: "-0.09em" }}>T</span>ätigkeiten
            </h1>
          </div>
          <div className="overlay-content-body">
            <div className="tatigkeiten-grid">
              {width >= 768 && (
                <div className="tatigkeiten-col-left">
                  <p>{about.tatigkeiten.subtitle}</p>
                </div>
              )}
              <div className="tatigkeiten-col-right">
                <div className="activity">
                  {width >= 768 ? (
                    <>
                      <div className="activity-info"></div>
                      <div className="activity-title">
                        <h4>
                          <PortableText
                            value={about.tatigkeiten.description}
                            components={linksBlank}
                          />
                        </h4>
                      </div>
                    </>
                  ) : (
                    <div className="activity-title">
                      <h5>
                        <p>{about.tatigkeiten.subtitle}</p>
                        <PortableText
                          value={about.tatigkeiten.description}
                          components={greyComp}
                        />
                      </h5>
                    </div>
                  )}
                </div>
                {about.tatigkeiten.activities &&
                  about.tatigkeiten.activities.activity.map((a, index) => (
                    <div className="activity">
                      <div className="activity-info">
                        <h3>{a.info}</h3>
                      </div>
                      <div className="activity-title">
                        <h4>{a.title}</h4>
                        <h4 className="activity-title-description">
                          <PortableText
                            value={a.description}
                            components={linksBlank}
                          />
                        </h4>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="overlay-content-title" data-index={1}>
            <h1>Vorstand</h1>
          </div>
          <div className="overlay-content-body">
            <div className="col-2-grid">
              {about.vorstand &&
                about.vorstand.map((a, index) => (
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
                            // {...useNextImageFade('')}
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
                        <div
                          className={
                            index + 1 !== about.vorstand.length ? "divider" : ""
                          }
                        ></div>
                      </>
                    )}
                  </React.Fragment>
                ))}
            </div>
          </div>
        </Overlay>
      </Modal>

      <Menu data={menuItems} />
    </MainLayout>
  );
}

export async function getStaticProps() {
  const [about] = await client.fetch(`
    *[_type == "about"] {
        _id,
        menuTitle,
        pageTitle,
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
        chronikTitle,
        chronikImage[] {
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height,
          "url": asset->url,
          "blurDataURL": asset->{
              metadata {
                lqip
              }
            }
      },
        chronikText,
        bereicheTitle,
        bereicheImage[] {
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height,
          "url": asset->url,
          "blurDataURL": asset->{
              metadata {
                lqip
              }
            }
        },
        bereicheText,
        statuten {
          "url": asset->url,
        },
        statutenImage[] {
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height,
          "url": asset->url,
          "blurDataURL": asset->{
              metadata {
                lqip
              }
            }
        },
        statutenText,
        tatigkeiten,
        vorstand[]-> {
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
        tatigkeitenImage[] {
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height,
          "url": asset->url,
          "blurDataURL": asset->{
              metadata {
                lqip
              }
            }
        },
        tatigkeitenText
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
      about,
      menuItems,
    },
    revalidate: 3600, // Revalidate every hour
  };
}
