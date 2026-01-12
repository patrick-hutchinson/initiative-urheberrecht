import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  cloneElement,
  isValidElement,
  use,
} from "react";
import gsap from "gsap";
import Toolbar from "./Toolbar";
import InnerFooter from "./InnerFooter";
import { OverlaysContext } from "../contexts/OverlaysContext";
import {
  freezeBackground,
  unfreezeBackground,
} from "../components/freezeBackground";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import resizeListener from "../components/resizeListener";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useRouter } from "next/router";
import { fi } from "date-fns/locale";
import { first } from "lodash";

export default function Overlay({
  id,
  toolbarDownload,
  anchors,
  anchorsTitle,
  children,
  noAnchor = false,
}) {
  const {
    overlays,
    storeOverlays,
    resetOverlays,
    closeEvent,
    storeCloseEvent,
    openEvent,
    storeOpenEvent,
  } = useContext(OverlaysContext);
  const [thisOverlay, setThisOverlay] = useState();
  const overlay = useRef();
  const childrenRef = useRef(null);

  gsap.registerPlugin(ScrollToPlugin);

  const router = useRouter();

  useEffect(() => {
    // If closeEvent is true and the modal query param exists, remove it.
    if (closeEvent && router.query.modal) {
      // Create a new URL without the modal query parameter.
      const { modal, ...restQuery } = router.query;

      // Use the router to update the URL without refreshing the page.
      router.replace(
        {
          pathname: router.pathname,
          query: restQuery,
        },
        undefined,
        { shallow: true, scroll: false }
      ); // prevent Next.js from scrolling to top
    }
  }, [closeEvent, router]);

  useEffect(() => {
    const foundOverlay = overlays.find((overlay) => overlay.ref === id);
    setThisOverlay(foundOverlay);
    if (foundOverlay && foundOverlay.show) {
      openOverlay(foundOverlay.ref, foundOverlay.i && foundOverlay.i);
    }

    // Scale effect
    gsap.registerPlugin(ScrollTrigger);

    const h1s = [...document.querySelectorAll(".overlay h1")];

    h1s.forEach((item, i) => {
      const anim = gsap.fromTo(
        item,
        {
          autoAlpha: 1,
          scale: 0.975,
          transformOrigin: "0 0",
        },
        {
          duration: 0.5,
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
  }, [overlays]);

  function scrollTo(y) {
    gsap.to(document.querySelector(".ReactModal__Content"), {
      scrollTo: y,
      duration: 1.2,
      ease: "power1.inOut",
    });
  }

  const openOverlay = (id, i) => {
    freezeBackground();
    // Removed automatic scroll-to-top; we want to keep the user's original position.
    overlay.current.style.display = "block";
    document
      .querySelector(".page")
      .classList.add("overlay-body-margin-compensator");

    gsap.fromTo(
      `#${id}`,
      {
        y: 100,
      },
      {
        y: 0,
        duration: 1,
        opacity: 1,
        onComplete: () => {
          if (i > 0) {
            scrollTo(
              document.querySelector(`[data-index="${i}"]`).offsetTop -
                getComputedStyle(document.body)
                  .getPropertyValue("--border")
                  .trim()
                  .replace("px", "") -
                4
            );
          }
        },
      }
    );
  };

  const closeOverlay = () => {
    // Unfreeze background and restore scroll first (overlay still fully opaque)
    unfreezeBackground();
    // Give the browser a moment (~50ms) to apply the restored scroll before we start fading.
    setTimeout(() => {
      gsap.to(document.querySelector(`#${id}`), {
        opacity: 0,
        duration: 1,
        // y: 6,
        onComplete: () => {
          overlay.current.style.display = "none";
          storeOverlays((prev) =>
            prev.map((overlay) => {
              if (overlay.ref === id) {
                return {
                  ...overlay,
                  show: false,
                };
              }
              return overlay;
            })
          );
          storeCloseEvent(true);
          storeOpenEvent(false);
          document
            .querySelector(".page")
            .classList.remove("overlay-body-margin-compensator");
        },
      });
    }, 50);
  };

  useEffect(() => {
    const toolbar = document.querySelector(".toolbar");
    const firstContentTitle = document.querySelector(".overlay-content-title");

    if (toolbar && firstContentTitle) {
      firstContentTitle.appendChild(toolbar);
    }
  }, []);

  return (
    <div
      className="overlay"
      id={id}
      ref={overlay}
      style={{ display: "none", opacity: "0" }}
    >
      <div className="overlay-content">
        <Toolbar
          download={toolbarDownload}
          anchors={anchors}
          anchorsTitle={anchorsTitle}
          noAnchor={noAnchor}
          closeFunc={closeOverlay}
        />
        {children}
        <InnerFooter download={toolbarDownload} closeFunc={closeOverlay} />
      </div>
      <div className="transparent-block-bottom" onClick={closeOverlay}></div>
    </div>
  );
}
