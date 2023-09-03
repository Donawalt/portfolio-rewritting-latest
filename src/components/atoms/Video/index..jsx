

import React from 'react';
import {
  getDocument,
  getWindow,
  isVisible,
} from "../../../assets/scripts/utils/dom";

const Video = (props) => {
  const { url, poster, width, height, lazy } = props;
  const el = React.useRef();
  const [isLazyVisible, setIsLazyVisible] = React.useState(false);

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
          data-src={url}
          poster={poster}
          width={width}
          height={height}
          controls="true"
        />
        {lazy && !isLazyVisible && (
          <picture className="video-poster" style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: '100%',
            height: '100%'
          }}>
            <img src={poster} alt="" width={width} height={height} />
          </picture>
        )}
        {lazy && (
          <noscript>
            <video src={url} poster={poster} width={width} height={height} />
          </noscript>
        )}
      </div>
    </>
  );
};

export default Video;