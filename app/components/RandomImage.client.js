import Image from "next/image";
import React, { useRef } from "react";

export default function RandomImageClient({ id, data, slug = "" }) {
  const imageRef = useRef(null);
  const keyRef = useRef("");

  const getNextImage = (images, uniqueId, slugIdentifier = "") => {
    if (!images || images.length === 0) return null;

    const shownImagesKey = `lastViewedImageIndex_${uniqueId}${
      slugIdentifier ? "_" + slugIdentifier : ""
    }`;

    let lastIndex = -1;
    if (typeof window !== "undefined" && localStorage.getItem(shownImagesKey)) {
      lastIndex = parseInt(localStorage.getItem(shownImagesKey), 10);
    }

    const nextIndex = (lastIndex + 1) % images.length;
    if (typeof window !== "undefined") {
      localStorage.setItem(shownImagesKey, nextIndex.toString());
    }

    return images[nextIndex];
  };

  if (typeof window !== "undefined") {
    const currentKey = `${id}_${slug}`;
    if (keyRef.current !== currentKey) {
      keyRef.current = currentKey;
      imageRef.current = getNextImage(data, id, slug);
    }
  }

  const selectedImage = imageRef.current;

  if (!selectedImage) return null;

  return (
    <Image
      className={
        selectedImage.width > selectedImage.height ? "mobile-hor" : "mobile-ver"
      }
      src={`${selectedImage.url}?dpr=1`}
      srcSet={`${selectedImage.url}?dpr=2 2x`}
      placeholder="blur"
      blurDataURL={selectedImage.blurDataURL.metadata.lqip}
      width={selectedImage.width}
      height={selectedImage.height}
      sizes="auto"
      priority
      alt="Random image"
    />
  );
}
