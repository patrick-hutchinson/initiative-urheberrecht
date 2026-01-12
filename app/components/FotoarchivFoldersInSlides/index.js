import styles from "./index.module.scss";
import { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { FotoarchivContext } from "../../contexts/FotoarchivContext";
import useWindowDimensions from "../useWindowDimensions";

export default function FotoarchivFoldersInSlides({
  src,
  chapterTitle = false,
  appliedClass,
}) {
  const { fotoarchivState, storeFotoarchivState } =
    useContext(FotoarchivContext);
  const { width } = useWindowDimensions();
  const [allFolders, setAllFolders] = useState(() => {
    const allFolders = [];

    src.fotoarchiv.map((folder, folderIndex) => {
      folder.images.map((image, index) => {
        image["dna"] = {
          part: fotoarchivState.part,
          id: fotoarchivState.id,
          folder: folderIndex,
          slide: index,
        };
      });
      allFolders.push(...folder.images);
    });

    return allFolders;
  });
  const counterRef = useRef(null);
  const splideRef = useRef(null);
  const [currentSlideInFolder, setCurrentSlideInFolder] = useState(
    allFolders.findIndex(
      (folder) =>
        folder.dna.folder === fotoarchivState.folder &&
        folder.dna.slide === fotoarchivState.slide
    )
  );
  const [aspectRatio, setAspectRatio] = useState(() => {
    const image = allFolders[currentSlideInFolder];
    return `${image.image.width} / ${image.image.height}`;
  });

  const handleSlideClick = (clickedIndex) => {
    const splide = splideRef.current?.splide;
    if (!splide) return;

    const nextIndex = (currentSlideInFolder + 1) % allFolders.length;

    if (clickedIndex === currentSlideInFolder) {
      splide.go("<");
    } else if (clickedIndex === nextIndex) {
      splide.go(">");
    }
  };

  useEffect(() => {
    const splide = splideRef.current?.splide;
    if (!splide) return;

    const showFirstSlide = () => {
      if (splide.index + 1 === allFolders.length) {
        setTimeout(() => {
          document
            .querySelector(`.${appliedClass} > div > ul > li:first-child`)
            .classList.add("is-next");
        }, 1);
      }
    };

    // Sync the clicked slide with the splide
    splide.go(currentSlideInFolder);
    showFirstSlide();

    const handleMove = () => {
      const currentImageDna = allFolders[splide.index].dna;

      storeFotoarchivState((prev) => ({
        ...prev,
        folder: currentImageDna.folder,
        slide: currentImageDna.slide,
      }));

      setCurrentSlideInFolder(splide.index);
      showFirstSlide();
    };

    splide.on("move", handleMove);

    return () => {
      splide.off("move", handleMove);
    };
  }, [allFolders.length]);

  useEffect(() => {
    setTimeout(() => {
      document.querySelector(`.splide__arrows`).style.opacity = 1;
    }, 300);
  }, []);

  useEffect(() => {
    setAspectRatio(
      `${allFolders[currentSlideInFolder].image.width} / ${allFolders[currentSlideInFolder].image.height}`
    );
  }, [currentSlideInFolder]);

  useEffect(() => {
    const updateTop = () => {
      if (window.innerWidth < 992) {
        const titleDiv = document.querySelector(".overlay-content-title");
        const border =
          parseInt(
            getComputedStyle(document.documentElement)
              .getPropertyValue("--border")
              .trim()
          ) * 1.5;
        const textHeight =
          window.innerWidth < 576 ? 9 : window.innerWidth < 768 ? 16 : 13;
        counterRef.current.style.top = `
          ${titleDiv.getBoundingClientRect().height - textHeight - border}px`;
      } else {
        counterRef.current.style.removeProperty("top");
      }
    };

    updateTop();
    window.addEventListener("resize", updateTop);

    return () => {
      window.removeEventListener("resize", updateTop);
    };
  }, [counterRef.current]);

  return (
    <div>
      <div
        className={styles["counter"]}
        ref={counterRef}
        style={{
          transition: "opacity 0.3s ease",
          opacity:
            counterRef.current?.style.top || window.innerWidth >= 992 ? 0.6 : 0,
        }}
      >
        {width >= 992 ? (
          <h1>
            <span>
              {currentSlideInFolder + 1}/{allFolders.length}
            </span>
          </h1>
        ) : (
          <h3>
            <span>
              {currentSlideInFolder + 1}/{allFolders.length}
            </span>
          </h3>
        )}
      </div>
      <div
        className={styles["all-folders"]}
        style={{
          aspectRatio: width < 992 ? aspectRatio : undefined,
        }}
      >
        <Splide
          ref={splideRef}
          className={`${styles["gallery"]} gallery-slides ${appliedClass}`}
          hasTrack={false}
          options={{
            type: "fade",
            rewind: true,
            focus: "left",
            perPage: 2,
            arrows: true,
            pagination: false,
          }}
          aria-label="gallery"
        >
          <SplideTrack>
            {allFolders.map((img, index) => (
              <SplideSlide key={index} onClick={() => handleSlideClick(index)}>
                <div
                  className={`
                    ${styles["slide"]}
                    ${
                      width >= 992 && img.image.height > img.image.width
                        ? styles["slide--vertical"]
                        : styles["slide--horizontal"]
                    }
                    ${width < 992 ? styles["slide--mobile"] : ""}
                  `}
                  style={{
                    aspectRatio:
                      width < 992
                        ? `${img.image.width} / ${img.image.height}`
                        : undefined,
                  }}
                >
                  <Image
                    src={`${img.image.url}?w=1600&auto=format&q=70`}
                    alt={img.caption || "image"}
                    width={img.image.width}
                    height={img.image.height}
                    fill={false}
                    placeholder="blur"
                    blurDataURL={img.image.blurDataURL}
                    sizes="(min-width: 1400px) 60vw, (min-width: 1024px) 75vw, (min-width: 768px) 90vw, 100vw"
                  />
                </div>
              </SplideSlide>
            ))}
          </SplideTrack>
          <div className="splide__arrows" style={{ opacity: 0 }}>
            <a className="splide__arrow splide__arrow--prev" />
            <a className="splide__arrow splide__arrow--next" />
          </div>
        </Splide>
      </div>
      <div className={styles["captions"]}>
        <h3>
          {allFolders[currentSlideInFolder].caption && (
            <span>
              {allFolders[currentSlideInFolder].caption}
              <br />
            </span>
          )}
          <span className={styles["captions__title"]}>
            {fotoarchivState?.part === "konferenz" ? "Konferenz " : ""}
            {src.menuTitle}
            {`, ${src.fotoarchiv[fotoarchivState.folder].title}`}
          </span>
        </h3>
        {/* <h3>Part: {fotoarchivState.part}, Id: {fotoarchivState.id}, Folder: {fotoarchivState.folder}, Slide: {fotoarchivState.slide} <br/></h3> */}
      </div>
      <div className={`${styles["credits"]} credits`}>
        <h3>© {src.fotoarchiv[fotoarchivState.folder].credits}</h3>
      </div>
    </div>
  );
}
