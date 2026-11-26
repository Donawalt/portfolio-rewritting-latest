

import * as React from "react";
import { BREAKPOINTS } from "../../../assets/scripts/utils/variables";
import {
  getDocument,
  getWindow,
  isVisible,
} from "../../../assets/scripts/utils/dom";
import { urlImageBuilder } from "../../../assets/scripts/utils/api/urlBuilder.js";
import { getImageDimensions } from "@sanity/asset-utils"; 
// Import component style
import "./picture.scss";
import { crossProduct } from "../../../assets/scripts/utils/math";

/**
 * Picture is a jsx Components made to manage picture loading and render
 * -------------
 * This function is used to render an image component that supports lazy-loading and responsive images. It takes three parameters, url, alt, and lazy, all of which are optional.
 * The url parameter is a string representing the URL of the image to be displayed.
 * The alt parameter is a string representing the alternative text for the image. It defaults to an empty string: an omitted alt marks a decorative image, so every rendered image element always has the attribute.
 * The lazy parameter is a boolean that indicates whether lazy-loading should be enabled for the image. If this is set to true, the image will only be loaded when it becomes visible in the viewport.
 * If lazy is true, a blurred version of the image is displayed until the image becomes visible in the viewport. The widthMobile, heightMobile, widthDesktop, heightDesktop, and crop parameters are used to generate the various versions of the image that will be loaded. If url is not provided, the posterMobile and posterDesktop parameters are used as the source URLs for the blurred version of the image.
 * If lazy is false, the image will be loaded immediately and the width and height parameters will be used to set the dimensions of the image.
 *
 */

/* 
If pictures is in locale , one picture is equal to 10 pictures imported 
<Picture 
    images={{mobile:{jpeg: ['hero-mobile-base.jpg', 'hero-mobile-retina.jpg'], webp: ['hero-mobile-base.webp', 'hero-desktop-retina.webp']}, desktop:{jpeg: ['hero-desktop-base.jpg', 'hero-desktop-retina.jpg'], webp: ['hero-desktop-base.webp', 'hero-desktop-retina.webp']}}} 
    alt="Image description"
    posterMobile={'hero-mobile-lazy.jpg'} 
    posterDesktop={'hero-desktop-lazy.jpg'}
    widthDesktop={"400"}
    heightDesktop={"300"}
    widthMobile={"40"}
    heightMobile={"40"}
    lazy={true}
/> */

/* 
If url used 
<Picture 
    url="sanity-url/" 
    crop={ null} 
    alt="Image description"
    widthDesktop={"400"}
    heightDesktop={"300"}
    widthMobile={"40"}
    heightMobile={"40"}
    lazy={true} 
/> */

const Picture = (props) => {
  const {
    images = {
      mobile: {
        jpeg: [""], //taille 1, 2X, 4X
        webp: [""],
      },
      desktop: {
        jpeg: [""],
        webp: [""],
      },
    },
    url,
    alt = "",
    lazy,
    posterMobile,
    posterDesktop,
    widthDesktop,
    heightDesktop,
    widthMobile,
    heightMobile,
    localSize, 
    crop,
  } = props;
  // Initialise lazy variables
  const el = React.useRef();
  const [isLazyVisible, setIsLazyVisible] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  let originalDimension = null;
  // if image is sanity 
  url && (originalDimension = getImageDimensions(url));
  // Define poster;
  const p = {
    mobile: url && originalDimension
      ? urlImageBuilder(
        url,
        10,
        Math.round(crossProduct( localSize ? widthMobile : originalDimension.width, localSize ? heightMobile : originalDimension.height, 10)),
        crop,
        "webp"
      )
      : posterMobile,
    desktop: url && originalDimension
      ? urlImageBuilder(
        url,
        20,
        Math.round(crossProduct(localSize ? widthDesktop: originalDimension.width, localSize ? heightDesktop: originalDimension.height, 20)),
        crop,
        "webp"
      )
      : posterDesktop,
      lazyDesktop: url && originalDimension ? urlImageBuilder(
        url,
        20,
        Math.round(crossProduct(localSize ? widthDesktop: originalDimension.width / 100, localSize ? heightDesktop: originalDimension.height / 100, 20)),
        crop,
        "jpg"
      ) : posterDesktop, 
      lazyMobile: url && originalDimension ? urlImageBuilder(
        url,
        20,
        Math.round(crossProduct( localSize ? widthMobile: originalDimension.width / 100, localSize ? heightMobile: originalDimension.height / 100, 20)),
        crop,
        "webp"
      ): posterMobile
  };

  // Get all imgs
  let imgs = url && originalDimension
    ? {
      mobile: {
        jpeg: [
          urlImageBuilder(url, widthMobile, Math.round(crossProduct(localSize ? widthMobile: originalDimension.width, localSize ? heightMobile: originalDimension.height, widthMobile)), crop, "jpg"),
          urlImageBuilder(url, widthMobile * 2, Math.round(crossProduct(localSize ? widthMobile: originalDimension.width, localSize ? heightMobile: originalDimension.height, widthMobile * 2)), crop, "jpg"),
        ],
        webp: [
          urlImageBuilder(url, widthMobile, Math.round(crossProduct(localSize ? widthMobile: originalDimension.width, localSize ? heightMobile: originalDimension.height, widthMobile)), crop, "webp"),
          urlImageBuilder(
            url,
            widthMobile * 2,
            Math.round(crossProduct(localSize ? widthMobile: originalDimension.width, localSize ? heightMobile: originalDimension.height, widthMobile * 2)),
            crop,
            "webp"
          ),
        ],
      },
      desktop: {
        jpeg: [
          urlImageBuilder(url, widthDesktop, Math.round(crossProduct(localSize ? widthDesktop: originalDimension.width, localSize ? heightDesktop: originalDimension.height, widthDesktop)), crop, "jpg"),
          urlImageBuilder(url, widthDesktop * 2, Math.round(crossProduct(localSize ? widthDesktop: originalDimension.width, localSize ? heightDesktop: originalDimension.height, widthDesktop * 2)), crop, "jpg"),
        ],
        webp: [
          urlImageBuilder(url, widthDesktop, Math.round(crossProduct(localSize ? widthDesktop: originalDimension.width, localSize ? heightDesktop: originalDimension.height, widthDesktop)), crop, "webp"),
          urlImageBuilder(
            url,
            widthDesktop * 2,
            Math.round(crossProduct(localSize ? widthDesktop: originalDimension.width, localSize ? heightDesktop: originalDimension.height, widthDesktop * 2)),
            crop,
            "webp"
          ),
        ],
      },
    }
    : images;

  // Width descriptors let the browser pick the smallest candidate that still
  // covers the rendered size. Callers that pass pre-built local arrays without
  // width props keep the legacy 1x/2x descriptors.
  const mobileWidth = Number(widthMobile) > 0 ? Number(widthMobile) : 0;
  const desktopWidth = Number(widthDesktop) > 0 ? Number(widthDesktop) : 0;
  const useWidthDescriptors = Boolean(mobileWidth && desktopWidth);
  const srcSet = (urls, width) =>
    useWidthDescriptors
      ? `${urls[0]} ${width}w, ${urls[1]} ${width * 2}w`
      : `${urls[0]} 1x, ${urls[1]} 2x`;
  const sizes = useWidthDescriptors
    ? `(max-width: ${BREAKPOINTS.tablet - 1}px) ${mobileWidth}px, ${desktopWidth}px`
    : undefined;
  const decoding = lazy ? "async" : undefined;

  // Init lazy functions
  const setIntersect = (state) => {
    const setVisible = () => {
      let sources = el.current.querySelectorAll("source");
      let img = el.current.querySelector("img");
      let pictureBlur = el.current.querySelector(".picture-blur");
      if (img.src !== img.dataset.src) {
        img.onload = () => {
          setIsLazyVisible(true);
          if (pictureBlur) {
            pictureBlur.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: 500,
              fill: "forwards",
            });
          }
        };

        // Change source url
        sources.forEach((element) => {
          element.srcSet = element.dataset.srcSet;
        });

        // Change img url

        img.src = img.dataset.src;
      }
    };
    if (el.current && isVisible(el.current) && !isLazyVisible) {
      setVisible();
    }

    if (state === "isVisible") {
      setVisible();
    }
  };

  const customIntersect = () => {
    getDocument().addEventListener("scroll", () => {
      setIsLazyVisible((value) => {
        if (!value) {
          setIntersect();
        }
        return value;
      });
    });
  };

  React.useEffect(() => {
    if (lazy && getWindow().self === getWindow().top) {
      customIntersect();
    } else {
      setIntersect("isVisible");
    }
  }, []);

  React.useEffect(() => {
    if (lazy && getWindow().self === getWindow().top) {
      customIntersect();
    } else {
      setIntersect("isVisible");
    }
  }, [url]);

  React.useEffect(() => {
    const checkMobile = () => {
      return getWindow().innerWidth < 769 ? true : false;
    };

    getWindow().addEventListener("resize", () => {
      if (isMobile !== checkMobile()) {
        setIsMobile(checkMobile());
      }
    });

    setIsMobile(checkMobile());
  }, [isMobile]);

  return (
    <>
      <picture {...props} ref={el} data-scc-component={true} style={{aspectRatio: !localSize && originalDimension && `${originalDimension.width} / ${originalDimension.height}`}}>
        <source
          type="image/webp"
          media={`(max-width: ${BREAKPOINTS.tablet - 1}px)`}
          data-src-set={`${srcSet(imgs?.mobile?.webp, mobileWidth)}`}
          sizes={sizes}
        />
        <source
          type="image/jpeg"
          media={`(max-width: ${BREAKPOINTS.tablet - 1}px)`}
          data-src-set={`${srcSet(imgs?.mobile?.jpeg, mobileWidth)}`}
          sizes={sizes}
        />
        <source
          type="image/webp"
          media={`(min-width: ${BREAKPOINTS.desktop + 1}px)`}
          data-src-set={`${srcSet(imgs?.desktop?.webp, desktopWidth)}`}
          sizes={sizes}
        />
        <source
          type="image/jpeg"
          media={`(min-width: ${BREAKPOINTS.desktop + 1}px)`}
          data-src-set={`${srcSet(imgs?.desktop?.jpeg, desktopWidth)}`}
          sizes={sizes}
        />
        <source
          type="image/webp"
          media={`(min-width: ${BREAKPOINTS.tablet}px)`}
          data-src-set={`${srcSet(imgs?.desktop?.webp, desktopWidth)}`}
          sizes={sizes}
        />
        <source
          type="image/jpeg"
          media={`(min-width: ${BREAKPOINTS.tablet}px)`}
          data-src-set={`${srcSet(imgs?.desktop?.jpeg, desktopWidth)}`}
          sizes={sizes}
        />
        <img
          src={undefined}
          data-src={imgs?.desktop?.jpeg[0]}
          alt={alt}
          width={widthDesktop}
          height={heightDesktop}
          sizes={sizes}
          decoding={decoding}
        />
        {lazy && (
          <div className="picture-blur">
            <img
              src={isMobile ? p?.lazyMobile : p?.lazyDesktop}
              alt={alt}
              width={widthDesktop}
              height={heightDesktop}
            />
          </div>
        )}
        {lazy && (
          <noscript>
            <source
              type="image/webp"
              media={`(max-width: ${BREAKPOINTS.tablet - 1}px)`}
              srcSet={`${srcSet(imgs?.mobile?.webp, mobileWidth)}`}
              sizes={sizes}
            />
            <source
              type="image/jpeg"
              media={`(max-width: ${BREAKPOINTS.tablet - 1}px)`}
              srcSet={`${srcSet(imgs?.mobile?.jpeg, mobileWidth)}`}
              sizes={sizes}
            />
            <source
              type="image/webp"
              media={`(min-width: ${BREAKPOINTS.desktop + 1}px)`}
              srcSet={`${srcSet(imgs?.desktop?.webp, desktopWidth)}`}
              sizes={sizes}
            />
            <source
              type="image/jpeg"
              media={`(min-width: ${BREAKPOINTS.desktop + 1}px)`}
              srcSet={`${srcSet(imgs?.desktop?.jpeg, desktopWidth)}`}
              sizes={sizes}
            />
            <source
              type="image/webp"
              media={`(min-width: ${BREAKPOINTS.tablet}px)`}
              srcSet={`${srcSet(imgs?.desktop?.webp, desktopWidth)}`}
              sizes={sizes}
            />
            <source
              type="image/jpeg"
              media={`(min-width: ${BREAKPOINTS.tablet}px)`}
              srcSet={`${srcSet(imgs?.desktop?.jpeg, desktopWidth)}`}
              sizes={sizes}
            />
            <img
              src={imgs?.desktop?.jpeg[0]}
              alt={alt}
              width={widthDesktop}
              height={heightDesktop}
              sizes={sizes}
              decoding={decoding}
            />
          </noscript>
        )}
      </picture>
    </>
  );
};

export default Picture;

const test = ({ type }) => {
  if (type == "url") {
    return (
      <Picture
        url="sanity-url/"
        crop={/*  Crop DATA */ null}
        alt="Image description"
        widthDesktop={"400"}
        heightDesktop={"300"}
        widthMobile={"40"}
        heightMobile={"40"}
        lazy={true}
      />
    );
  }
  // If pictures is in locale
  return (
    <Picture
      images={{
        mobile: {
          jpeg: ["hero-mobile-base.jpg", "hero-mobile-retina.jpg"],
          webp: ["hero-mobile-base.webp", "hero-desktop-retina.webp"],
        },
        desktop: {
          jpeg: [
            "hero-desktop-base.jpg",
            "hero-desktop-retina.jpg",
            "hero-desktop-retina-x2.jpg",
          ],
          webp: [
            "hero-desktop-base.webp",
            "hero-desktop-retina.webp",
            "hero-desktop-retina-x2.webp",
          ],
        },
      }}
      alt="Image description"
      posterMobile={"hero-mobile-lazy.jpg"}
      posterDesktop={"hero-desktop-lazy.jpg"}
      widthDesktop={"400"}
      heightDesktop={"300"}
      widthMobile={"40"}
      heightMobile={"40"}
      lazy={true}
    />
  );
};