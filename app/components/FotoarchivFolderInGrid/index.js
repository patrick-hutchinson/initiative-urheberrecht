import styles from "./index.module.scss";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { FotoarchivContext } from "../../contexts/FotoarchivContext";

export default function FotoarchivFolderInGrid({
  src,
  chapterTitle = false,
  folderIndex,
}) {
  const { fotoarchivState, storeFotoarchivState, toggleHeight } =
    useContext(FotoarchivContext);

  return (
    <div className={styles["folder"]}>
      {src.images && (
        <div className={styles["folder__photos"]}>
          {src.images.map((img, index) => (
            <a
              key={index}
              className={`
                ${styles["photo"]} 
                ${
                  img.image.height > img.image.width
                    ? styles["photo--vertical"]
                    : ""
                }
              `}
              onClick={() => {
                storeFotoarchivState((prev) => ({
                  ...prev,
                  mode: "slides",
                  folder: folderIndex,
                  slide: index,
                }));
                toggleHeight("slides");
              }}
            >
              <Image
                src={`${img.image.url}?w=800&auto=format&q=70`}
                alt={img.caption || "image"}
                width={img.image.width}
                height={img.image.height}
                placeholder="blur"
                blurDataURL={img.image.blurDataURL}
                sizes="(min-width: 1400px) 12vw, (min-width: 1024px) 16vw, (min-width: 768px) 22vw, 40vw"
              />
            </a>
          ))}
        </div>
      )}
      <div className={styles["folder__chapter-title"]}>
        <h3>
          {chapterTitle ? `${chapterTitle}.` : ""} {src.title}
        </h3>
      </div>
    </div>
  );
}
