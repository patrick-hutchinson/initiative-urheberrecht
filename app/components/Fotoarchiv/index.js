import styles from "./index.module.scss";
import FotoarchivToolbar from "../FotoarchivToolbar";
import FotoarchivModeChanger from "../FotoarchivModeChanger";
import FotoarchivFolderInGrid from "../FotoarchivFolderInGrid";
import FotoarchivFoldersInSlides from "../FotoarchivFoldersInSlides";
import { useState, useEffect, useContext } from "react";
import { FotoarchivContext } from "../../contexts/FotoarchivContext";

export default function Fotoarchiv({ src, selection }) {
  const { fotoarchivState, storeFotoarchivState } =
    useContext(FotoarchivContext);

  useEffect(() => {
    document.querySelector(".overlay-content-title-span").innerText =
      src[fotoarchivState.part][fotoarchivState.id].menuTitle || "Fotos";
  }, [fotoarchivState]);

  return (
    <>
      <FotoarchivToolbar src={src} />
      <FotoarchivModeChanger />
      <section className={styles["fotoarchiv"]}>
        {fotoarchivState.mode === "grid" && (
          <div
            key={`${fotoarchivState.part}-${fotoarchivState.id}`}
            className={styles["grid-mode"]}
          >
            {src[fotoarchivState.part][fotoarchivState.id].fotoarchiv.map(
              (folder, index) => (
                <FotoarchivFolderInGrid
                  key={index}
                  folderIndex={index}
                  src={folder}
                  chapterTitle={
                    fotoarchivState.part === "konferenz"
                      ? `Konferenz ${
                          src[fotoarchivState.part][fotoarchivState.id]
                            .menuTitle
                        }`
                      : null
                  }
                />
              )
            )}
          </div>
        )}
        {fotoarchivState.mode === "slides" && (
          <div className={styles["slide-mode"]}>
            <FotoarchivFoldersInSlides
              key={`${fotoarchivState.part}-${fotoarchivState.id}`}
              src={src[fotoarchivState.part][fotoarchivState.id]}
              appliedClass={`${fotoarchivState.part}-${fotoarchivState.id}`}
              chapterTitle={
                fotoarchivState.part === "konferenz"
                  ? `Konferenz ${
                      src[fotoarchivState.part][fotoarchivState.id].menuTitle
                    }`
                  : null
              }
            />
          </div>
        )}
      </section>
    </>
  );
}
