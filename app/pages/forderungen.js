import { MainLayout } from "../components/MainLayout";
import React, { useEffect, useRef, useState, useContext } from "react";
import { gsap } from "gsap/dist/gsap";
import Menu from "../components/Menu";
import client from "../sanityClient";
import RandomImage from "../components/RandomImage";
import Slogan from "../components/Slogan";
import Footer from "../components/Footer";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import showAfterLoad from "../components/showAfterLoad";
import { OverlaysContext } from "../contexts/OverlaysContext";
import Overlay from "../components/Overlay";
import useWindowDimensions from "../components/useWindowDimensions";
import { useRouter } from "next/router";
import OverflowPortableText from "../components/overflowPortableText";
import Link from "next/link";
import Modal from "react-modal";
import checkBack from "../components/checkBack";

Modal.setAppElement("#__next");

export default function Forderungen({ forderungen, menuItems }) {
  const {
    overlays,
    storeOverlays,
    resetOverlays,
    closeEvent,
    storeCloseEvent,
    openEvent,
    storeOpenEvent,
  } = useContext(OverlaysContext);
  const forAnchorRef = useRef();

  const { width, height } = useWindowDimensions();

  showAfterLoad();

  const router = useRouter();

  useEffect(() => {
    document.body.style.background = getComputedStyle(
      document.querySelector(":root")
    ).getPropertyValue("--color_white");
  }, []);

  const registerOverlays = () => {
    storeOverlays([
      {
        ref: "forderungen-branches",
        // anchorY: forAnchorRef.current.offsetTop - 18,
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
    router.push(`/forderungen?modal=${ref}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const greyComp = {
    block: ({ children }) => <p className="grey">{children}</p>,
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

  const underlineComp = {
    marks: {
      underline: ({ children }) => (
        <span className="underline">{children}</span>
      ),
      link: ({ children, value }) => {
        return (
          <a href={value.href} rel="noreferrer noopener" target="_blank">
            {children}
          </a>
        );
      },
      strong: ({ children }) => (
        <span className="underline-black">{children}</span>
      ),
    },
  };

  const greyAndUnderlineComp = {
    block: ({ children }) => <p className="grey">{children}</p>,
    marks: {
      underline: ({ children }) => (
        <span className="underline">{children}</span>
      ),
      link: ({ children, value }) => {
        return (
          <a href={value.href} rel="noreferrer noopener" target="_blank">
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
        document.querySelector("#forderungen-branches"),
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
      <section id="forderungen" className="page" style={{ opacity: 0 }}>
        {forderungen.pageTitle && (
          <div className="uniblock">
            <div className="uniblock-title">
              <h1 className="scalable-first over">
                <a
                  className="no-underline"
                  onClick={() => handleNavigation("/")}
                >
                  <span style={{ letterSpacing: "-0.06em" }}>©</span>
                </a>
                {width < 576 ? <br /> : ` `}
                {forderungen.pageTitle}
              </h1>
            </div>
            <div className="uniblock-image">
              {forderungen.topImages[0].url && (
                <RandomImage
                  id={forderungen.menuTitle}
                  data={forderungen.topImages}
                />
              )}
            </div>
            {width > 992 ? (
              <div className="uniblock-text">
                <PortableText
                  value={forderungen.description}
                  components={underlineComp}
                />
              </div>
            ) : (
              <OverflowPortableText
                value={forderungen.description}
                components={underlineComp}
              />
            )}
          </div>
        )}
        {forderungen.forderungen.categories && (
          <div className="block">
            <div className="block-title">
              {forderungen.forderungen.categories.map(
                (c, index) =>
                  index !== forderungen.forderungen.categories.length - 1 && (
                    <h1 className="scalable" key={index} ref={forAnchorRef}>
                      <a
                        onClick={() =>
                          openOverlay("forderungen-branches", index)
                        }
                      >
                        {width > 576 ? (
                          <>{c.title}</>
                        ) : c.mobileTitle ? (
                          <>{c.mobileTitle}</>
                        ) : (
                          <>{c.title}</>
                        )}
                        {/* ({c.branches.branch ? c.branches.branch.length : '0'}) */}
                      </a>
                    </h1>
                  )
              )}
              {forderungen.fzuCategory && (
                <h1 className="scalable">
                  <a
                    onClick={() =>
                      openOverlay(
                        "forderungen-branches",
                        forderungen.forderungen.categories.length - 1
                      )
                    }
                  >
                    {width > 576
                      ? forderungen.fzuCategory.title
                      : forderungen.fzuCategory.titleMobile}
                    {/* ({forderungen.fzuCategory.branches.branch ? forderungen.fzuCategory.branches.branch.length : '0'}) */}
                  </a>
                </h1>
              )}
            </div>
            <div className="block-image link-on-top-x">
              {forderungen.middleImage.url && (
                <Image
                  src={`${forderungen.middleImage.url}?dpr=1`}
                  srcSet={`${forderungen.middleImage.url}?dpr=2 2x`}
                  placeholder="blur"
                  blurDataURL={
                    forderungen.middleImage.blurDataURL.metadata.lqip
                  }
                  width={forderungen.middleImage.width}
                  height={forderungen.middleImage.height}
                  sizes="auto"
                  priority
                  // {...useNextImageFade('')}
                />
              )}
            </div>
            <div className="block-text">
              <PortableText
                value={forderungen.middleDescription}
                components={underlineComp}
              />
            </div>
          </div>
        )}
        {/* {forderungen.fzuCategory && (
                    <div className='uniblock'>
                        <div className='uniblock-title'>
                          <h1 className="scalable">
                            <a onClick={() => openOverlay('forderungen-branches', forderungen.forderungen.categories.length-1)}>
                              {width > 576 ? forderungen.fzuCategory.title : forderungen.fzuCategory.titleMobile} 
                            </a>
                          </h1>
                        </div>
                        <div className='uniblock-image link-on-top'>
                          {forderungen.bottomImage[0].url !== null && <RandomImage id={forderungen.menuTitle+'2'} data={forderungen.bottomImage} />}
                        </div>
                        {
                          width > 992 
                            ? 
                              <div className='uniblock-text'>
                                  <PortableText value={forderungen.bottomDescription} components={underlineComp}/>
                              </div>
                            :
                               <OverflowPortableText value={forderungen.bottomDescription} components={underlineComp}/>
                        }
                    </div>
                      )} */}
        <Slogan
          firstPhrase={{ intro: "Wir schätzen", accent: "Kreativität" }}
          secondPhrase={{ intro: "Wir schützen", accent: "Originalität" }}
          thirdPhrase={{ intro: "Wir vertreten", accent: "Urheber:innen" }}
        />
        <Footer />
      </section>

      {/* FORDERUNGEN */}
      <Modal
        isOpen={
          overlays.find((overlay) => overlay.ref === "forderungen-branches") &&
          overlays.find((overlay) => overlay.ref === "forderungen-branches")
            .show
        }
        onRequestClose={() =>
          router.push("/forderungen", undefined, {
            shallow: true,
            scroll: false,
          })
        }
        style={modalStyle}
      >
        <Overlay
          id="forderungen-branches"
          anchors={forderungen.forderungen.categories}
          noAnchor={true}
        >
          {forderungen.forderungen.categories &&
            forderungen.forderungen.categories.map((c, index) => (
              <React.Fragment key={index}>
                <div className="overlay-content-title">
                  <h1 data-index={index}>
                    {index === 0 ? (
                      width < 576 ? (
                        <>
                          <span>
                            <a
                              onClick={() => handleNavigation("/")}
                              className="no-underline white"
                            >
                              ©
                            </a>{" "}
                          </span>
                          <br />
                          <span>Forderungen</span>
                        </>
                      ) : (
                        <>
                          <span style={{ letterSpacing: "-0.06em" }}>
                            <a
                              onClick={() => handleNavigation("/")}
                              className="no-underline white"
                            >
                              ©
                            </a>
                          </span>{" "}
                          Forderungen
                        </>
                      )
                    ) : (
                      c.title
                    )}
                  </h1>
                </div>
                {c.branches.branch &&
                  c.branches.branch.map((b, j) => (
                    <React.Fragment key={j}>
                      <div className="overlay-content-body">
                        <div className="tatigkeiten-grid border-top">
                          <div className="tatigkeiten-col-left">
                            {width >= 768 && (
                              <div className="tatigkeiten-col-left">
                                <p>{b.title}</p>
                              </div>
                            )}
                          </div>
                          <div className="tatigkeiten-col-right">
                            {b.description && b.description.length > 0 && (
                              <div className="activity">
                                {width >= 768 ? (
                                  <>
                                    <div className="activity-info"></div>
                                    <div className="activity-title">
                                      <h4>
                                        <PortableText
                                          value={b.description}
                                          components={underlineComp}
                                        />
                                      </h4>
                                    </div>
                                  </>
                                ) : (
                                  <div className="activity-title">
                                    <h5>
                                      <p>{b.title}</p>
                                      <PortableText
                                        value={b.description}
                                        components={greyAndUnderlineComp}
                                      />
                                    </h5>
                                  </div>
                                )}
                              </div>
                            )}
                            {b.articles &&
                              b.articles.article.map((a, k) => (
                                <div className="activity" key={k}>
                                  <div className="activity-info">
                                    <h3>{a.info}</h3>
                                  </div>
                                  <div className="activity-title">
                                    <h4>{a.articleTitle}</h4>
                                    <h4 className="activity-title-description">
                                      <PortableText
                                        value={a.articleText}
                                        components={underlineComp}
                                      />
                                    </h4>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}
        </Overlay>
      </Modal>

      <Menu data={menuItems} />
    </MainLayout>
  );
}

export async function getStaticProps() {
  const [forderungen] = await client.fetch(`
    *[_type == "forderungen"] {
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
        forderungen,
        fzuCategory,
        middleImage {
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height,
          "url": asset->url,
          "blurDataURL": asset->{
              metadata {
                lqip
              }
          }
        },
        middleDescription,
        bottomImage[] {
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height,
          "url": asset->url,
          "blurDataURL": asset->{
              metadata {
                lqip
              }
          }
        },
        bottomDescription
      }
  `);
  const menuItems = await client.fetch(`
    *[defined(menuTitle) && id != "datenschutz" && id != null] | order(order asc) {
      id,
      menuTitle,
      slug
    } 
  `);

  let allForderungen = 0;
  if (forderungen.forderungen && forderungen.forderungen.categories) {
    allForderungen = forderungen.forderungen.categories.reduce(
      (total, category) => {
        return (
          total +
          (category.branches && category.branches.branch
            ? category.branches.branch.length
            : 0)
        );
      },
      0
    );
  }

  forderungen.allForderungen = allForderungen;
  forderungen.forderungen.categories = [
    ...forderungen.forderungen.categories,
    forderungen.fzuCategory,
  ];

  return {
    props: {
      forderungen,
      menuItems,
    },
    revalidate: 3600, // Revalidate every hour
  };
}
