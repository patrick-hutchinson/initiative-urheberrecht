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
import Link from "next/link";
import OverflowPortableText from "../components/overflowPortableText";
import Modal from "react-modal";
import checkBack from "../components/checkBack";

Modal.setAppElement("#__next");

export default function Mitglieder({ mitglieder, menuItems }) {
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
        ref: "mitglieder-overlay",
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
    router.push(`/organisation?modal=${ref}`, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const greyComp = {
    block: ({ children }) => <p className="grey">{children}</p>,
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

  const linksBlank = {
    marks: {
      link: ({ children, value }) => {
        return (
          <a href={value.href} rel="noreferrer noopener" target="_blank">
            {children}
          </a>
        );
      },
      strong: ({ children }) => <span className="underline">{children}</span>,
    },
  };

  const greyAndUnderlineComp = {
    block: ({ children }) => <p className="grey">{children}</p>,
    marks: {
      underline: ({ children }) => (
        <span className="underline">{children}</span>
      ),
    },
  };

  const handleNavigation = (path) => {
    gsap.to(
      [
        document.querySelector(".page"),
        document.querySelector("nav"),
        document.querySelector("#mitglieder-branches"),
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
      <section id="mitglieder-page" className="page" style={{ opacity: 0 }}>
        {mitglieder.pageTitle && (
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
                {mitglieder.pageTitle}
              </h1>
            </div>
            <div className="uniblock-image">
              {mitglieder.topImages && (
                <RandomImage
                  id={mitglieder.menuTitle}
                  data={mitglieder.topImages}
                />
              )}
            </div>
            {width > 992 ? (
              <div className="uniblock-text">
                <PortableText
                  value={mitglieder.description}
                  components={underlineComp}
                />
              </div>
            ) : (
              <OverflowPortableText
                value={mitglieder.description}
                components={underlineComp}
              />
            )}
          </div>
        )}
        <div className="block">
          <div className="block-title">
            <h1 className="scalable">
              <a onClick={() => openOverlay("mitglieder-overlay", 0)}>
                {mitglieder.verbande.title}
              </a>
            </h1>
            <h1 className="scalable">
              <a onClick={() => openOverlay("mitglieder-overlay", 0)}>
                {mitglieder.extraordinaryMembers.title}
              </a>
            </h1>
            <h1 className="scalable">
              <a onClick={() => openOverlay("mitglieder-overlay", 1)}>
                {mitglieder.organisations.title}
              </a>
            </h1>
            <h1 className="scalable">
              <a onClick={() => openOverlay("mitglieder-overlay", 2)}>
                {mitglieder.rechtsbeistande.title}
              </a>
            </h1>
          </div>
          <div className="block-image link-on-top-x">
            {mitglieder.middleImage.url && (
              <Image
                src={`${mitglieder.middleImage.url}?dpr=1`}
                srcSet={`${mitglieder.middleImage.url}?dpr=2 2x`}
                placeholder="blur"
                blurDataURL={mitglieder.middleImage.blurDataURL.metadata.lqip}
                width={mitglieder.middleImage.width}
                height={mitglieder.middleImage.height}
                sizes="auto"
                priority
                // {...useNextImageFade('')}
              />
            )}
          </div>
          <div className="block-text">
            <PortableText
              value={mitglieder.middleDescription}
              components={underlineComp}
            />
          </div>
        </div>
        <Slogan
          firstPhrase={{ intro: "Wir schätzen", accent: "Handwerk" }}
          secondPhrase={{ intro: "Wir schützen", accent: "Geistiges Eigentum" }}
          thirdPhrase={{ intro: "Wir vertreten", accent: "Kunstschaffende" }}
        />
        <Footer />
      </section>

      {/* MITGLIEDER OVERLAY */}
      <Modal
        isOpen={
          overlays.find((overlay) => overlay.ref === "mitglieder-overlay") &&
          overlays.find((overlay) => overlay.ref === "mitglieder-overlay").show
        }
        onRequestClose={() =>
          router.push("/organisation", undefined, {
            shallow: true,
            scroll: false,
          })
        }
        style={modalStyle}
      >
        <Overlay
          id="mitglieder-overlay"
          anchors={[
            { title: mitglieder.verbande.title },
            { title: mitglieder.extraordinaryMembers.title },
            { title: mitglieder.organisations.title },
            { title: mitglieder.rechtsbeistande.title },
          ]}
          anchorsTitle={mitglieder.menuTitle}
        >
          {mitglieder.verbande && (
            <>
              <div className="overlay-content-title">
                <h1 data-index={0}>
                  <span style={{ letterSpacing: "-0.06em" }}>
                    ©<br />
                  </span>{" "}
                  {mitglieder.verbande.title}
                </h1>
              </div>
              <div className="overlay-content-body">
                <div className="persons">
                  {mitglieder.verbande.verband[0] &&
                    mitglieder.verbande.verband.map((v, index) => (
                      <React.Fragment key={index}>
                        <div className="person">
                          <div className="person-title">
                            <h3>
                              {v.title}
                              <PortableText
                                value={v.description}
                                components={linksBlank}
                              />
                            </h3>
                          </div>
                          <div className="mitglieder-logo">
                            {v.imageUrl && (
                              <Image
                                src={`${v.imageUrl}?dpr=1`}
                                srcSet={`${v.imageUrl}?dpr=2 2x`}
                                width="0"
                                height="0"
                                sizes="auto"
                                priority
                                // {...useNextImageFade('')}
                              />
                            )}
                          </div>
                        </div>
                        {width >= 768 && index % 4 === 3 && (
                          <>
                            <div></div>
                            <div
                              className={
                                index + 1 !== mitglieder.verbande.verband.length
                                  ? "divider"
                                  : ""
                              }
                            ></div>
                          </>
                        )}
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </>
          )}
          {mitglieder.extraordinaryMembers && (
            <>
              <div className="overlay-content-title">
                <h1 data-index={1}>{mitglieder.extraordinaryMembers.title}</h1>
              </div>
              <div className="overlay-content-body">
                <div className="persons">
                  {mitglieder.extraordinaryMembers.extraordinaryMember[0] &&
                    mitglieder.extraordinaryMembers.extraordinaryMember.map(
                      (v, index) => (
                        <React.Fragment key={index}>
                          <div className="person">
                            <div className="person-title">
                              <h3>
                                {v.title}
                                <PortableText
                                  value={v.description}
                                  components={linksBlank}
                                />
                              </h3>
                            </div>
                            <div className="mitglieder-logo">
                              {v.imageUrl && (
                                <Image
                                  src={`${v.imageUrl}?dpr=1`}
                                  srcSet={`${v.imageUrl}?dpr=2 2x`}
                                  width="0"
                                  height="0"
                                  sizes="auto"
                                  priority
                                  // {...useNextImageFade('')}
                                />
                              )}
                            </div>
                          </div>
                          {width >= 768 && index % 4 === 3 && (
                            <>
                              <div></div>
                              <div
                                className={
                                  index + 1 !==
                                  mitglieder.extraordinaryMembers
                                    .extraordinaryMember.length
                                    ? "divider"
                                    : ""
                                }
                              ></div>
                            </>
                          )}
                        </React.Fragment>
                      )
                    )}
                </div>
              </div>
            </>
          )}
          {mitglieder.organisations && (
            <>
              <div className="overlay-content-title">
                <h1 data-index={2}>{mitglieder.organisations.title}</h1>
              </div>
              <div className="overlay-content-body">
                <div className="tatigkeiten-grid">
                  {/* <div className="mitglieder-organisationen">
                                    <PortableText value={mitglieder.organisations.description}/>
                                </div> */}
                  {width >= 768 ? (
                    <div className="mitglieder-organisationen">
                      <PortableText
                        value={mitglieder.organisations.description}
                        components={linksBlank}
                      />
                    </div>
                  ) : (
                    <h5>
                      <PortableText
                        value={mitglieder.organisations.description}
                        components={linksBlank}
                      />
                    </h5>
                  )}
                </div>
                <div className="col-2-grid-border">
                  {mitglieder.organisations.organisation[0] &&
                    mitglieder.organisations.organisation.map((o, index) => (
                      <React.Fragment key={index}>
                        <div className="person">
                          <div className="person-title">
                            <h3>
                              <Link href={o.url} target="_blank">
                                {o.url}
                              </Link>
                            </h3>
                          </div>
                          <div className="mitglieder-logo">
                            {o.imageUrl && (
                              <Image
                                src={`${o.imageUrl}?dpr=1`}
                                srcSet={`${o.imageUrl}?dpr=2 2x`}
                                width="0"
                                height="0"
                                sizes="auto"
                                priority
                                // {...useNextImageFade('')}
                              />
                            )}
                          </div>
                        </div>
                        {width >= 768 && index % 4 === 3 && (
                          <>
                            <div></div>
                            <div
                              className={
                                index + 1 !==
                                mitglieder.organisations.organisation.length
                                  ? "divider"
                                  : ""
                              }
                            ></div>
                          </>
                        )}
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </>
          )}
          {mitglieder.rechtsbeistande && (
            <>
              <div className="overlay-content-title">
                <h1 data-index={3}>{mitglieder.rechtsbeistande.title}</h1>
              </div>
              <div className="overlay-content-body">
                <div className="col-2-grid">
                  {mitglieder.rechtsbeistande.people[0] &&
                    mitglieder.rechtsbeistande.people.map((p, index) => (
                      <React.Fragment key={index}>
                        <div className="person">
                          <div className="person-title">
                            <h3>
                              {p.name} <br /> {p.regalia}
                            </h3>
                          </div>
                          <div className="person-photo">
                            {p.imageUrl && (
                              <Image
                                src={`${p.imageUrl}?dpr=1`}
                                srcSet={`${p.imageUrl}?dpr=2 2x`}
                                placeholder="blur"
                                blurDataURL={p.blurDataURL.metadata.lqip}
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
                                value={p.about}
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
                                index + 1 !==
                                mitglieder.rechtsbeistande.people.length
                                  ? "divider"
                                  : ""
                              }
                            ></div>
                          </>
                        )}
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </>
          )}
        </Overlay>
      </Modal>

      <Menu data={menuItems} />
    </MainLayout>
  );
}

export async function getStaticProps() {
  const [mitglieder] = await client.fetch(`
    *[_type == "mitglieder"] {
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
        verbande {
          title,
          verband[]{
            title,
            description,
            "imageUrl": logo.asset->url,
          }
        },
        extraordinaryMembers {
          title,
          extraordinaryMember[]{
            title,
            description,
            "imageUrl": logo.asset->url,
          }
        },
        organisations {
          title,
          description,
          organisation[]{
            url,
            "imageUrl": logo.asset->url,
          }
        },
        rechtsbeistande {
          title,
          people[]->{
            name,
            regalia,
            about,
            "imageUrl": image.asset->url,
            "blurDataURL": image.asset->{
                metadata {
                    lqip
                }
            }
          }
        },
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
      }
  `);
  const menuItems = await client.fetch(`
    *[defined(menuTitle) && id != "datenschutz"] | order(order asc) {
      id,
      menuTitle,
      slug
    }
  `);

  return {
    props: {
      mitglieder,
      menuItems,
    },
    revalidate: 3600, // Revalidate every hour
  };
}
