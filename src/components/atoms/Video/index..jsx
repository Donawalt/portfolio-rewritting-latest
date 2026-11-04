

import React from 'react';
import {
  getDocument,
  getWindow,
  isVisible,
} from "../../../assets/scripts/utils/dom";
import { urlFileBuilder } from "../../../assets/scripts/utils/api/urlBuilder";

const Video = (props) => {
  const { url, poster, width, height, lazy } = props;
  const videoUrl = urlFileBuilder ? urlFileBuilder(url) : url;
  const posterUrl = poster ? (urlFileBuilder ? urlFileBuilder(poster) : poster) : null;
  const el = React.useRef();
  const [isLazyVisible, setIsLazyVisible] = React.useState(false);
  const [generatedPoster, setGeneratedPoster] = React.useState(null);
  const finalPoster = posterUrl || generatedPoster;

  const setIntersect = () => {
    const setVisible = () => {
      const video = el.current.querySelector("video");
      if (video.src !== video.dataset.src) {
        video.onloadeddata = () => {
          setIsLazyVisible(true);
        };
        video.src = video.dataset.src;
      }
    };

    if (el.current && isVisible(el.current) && !isLazyVisible) {
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
    if (!posterUrl && videoUrl && !generatedPoster) {
      try {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.muted = true;
        video.crossOrigin = 'anonymous';
        video.playsInline = true;
        const onLoaded = () => {
          try {
            video.currentTime = 0.01;
          } catch (e) {
            try {
              video.currentTime = 0;
            } catch (e2) { }
          }
        };
        const onSeeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || width || 640;
            canvas.height = video.videoHeight || height || 360;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
              setGeneratedPoster(dataUrl);
            }
            video.removeEventListener('loadeddata', onLoaded);
            video.removeEventListener('seeked', onSeeked);
          } catch (e) {
            video.removeEventListener('loadeddata', onLoaded);
            video.removeEventListener('seeked', onSeeked);
          }
        };
        video.addEventListener('loadeddata', onLoaded);
        video.addEventListener('seeked', onSeeked);
        video.load();
      } catch (e) {
        // ignore
      }
    }
  }, [posterUrl, videoUrl]);

  React.useEffect(() => {
    if (lazy && getWindow().self === getWindow().top) {
      customIntersect();
    } else {
      setIntersect();
    }
  }, []);

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
          poster={finalPoster}
          width={width}
          height={height}
          muted
          loop
          autoPlay
          playsInline
        />
        {lazy && !isLazyVisible && finalPoster && (
          <picture className="video-poster" style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: '100%',
            height: '100%'
          }}>
            <img
              src={finalPoster}
              alt=""
              width={width}
              height={height}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(20px)',
                transform: 'scale(1.1)'
              }}
            />
          </picture>
        )}
        {lazy && (
          <noscript>
            <video src={videoUrl} poster={finalPoster} width={width} height={height} muted loop autoPlay playsInline />
          </noscript>
        )}
      </div>
    </>
  );
};

export default Video;