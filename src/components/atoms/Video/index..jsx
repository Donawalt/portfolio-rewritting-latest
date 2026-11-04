

import React from 'react';
import { urlFileBuilder } from "../../../assets/scripts/utils/api/urlBuilder";

const Video = (props) => {
  const { url, poster, width, height, lazy } = props;
  const videoUrl = urlFileBuilder ? urlFileBuilder(url) : url;
  const posterUrl = poster ? (urlFileBuilder ? urlFileBuilder(poster) : poster) : null;
  const el = React.useRef();

  React.useEffect(() => {
    const container = el.current;
    if (!container) return;
    const video = container.querySelector("video");
    if (!video) return;

    // Assign the source only when the video is about to be seen, so the CDN
    // is never hit for videos further down the page.
    const start = () => {
      const source = video.dataset.src;
      if (source && video.getAttribute("src") !== source) {
        video.setAttribute("src", source);
      }
      const play = video.play();
      if (play && typeof play.catch === "function") play.catch(() => {});
    };

    if (!lazy || typeof IntersectionObserver === "undefined") {
      start();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
          } else if (!video.paused) {
            video.pause();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [videoUrl, lazy]);

  return (
    <>
      <div ref={el} data-scc-component={true} style={{
        position: 'relative',
        width: '100%',
        height: 'auto',
      }}>
        <video
          src={undefined}
          data-src={videoUrl}
          poster={posterUrl}
          width={width}
          height={height}
          preload="none"
          muted
          loop
          autoPlay
          playsInline
        />
        {lazy && (
          <noscript>
            <video src={videoUrl} poster={posterUrl} width={width} height={height} muted loop autoPlay playsInline />
          </noscript>
        )}
      </div>
    </>
  );
};

export default Video;
