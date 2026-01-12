import { useState } from "react";

export const useNextImageFade = (_className) => {
    const [className, setClassName] = useState(`${_className} pixelated`);
    return {
      className,
      onLoadingComplete: (target) => {
        setClassName(`${_className} non-pixelated`);
      },
    }
}