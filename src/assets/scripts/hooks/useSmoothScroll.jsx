import React from "react";
import Lenis from "lenis";
import eventBus from "../utils/eventBus";
function useSmoothScroll() {
  const [lenis, setLenis] = React.useState(null);

  React.useLayoutEffect(() => {
    if (window.lenis) return window.lenis;
    const l = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
      // wrapper: document.querySelector("body"), // element that has overflow
    });

    setLenis(l);

    const scrollFn = (time) => {
      l.raf(time);
      requestAnimationFrame(scrollFn);
    };

    requestAnimationFrame(scrollFn);

    window.lenis = l;
    eventBus.dispatch("lenisLoaded", { isLoaded: true });
    l?.stop();
    return lenis?.destroy();
  }, []);

  return lenis;
}

export default useSmoothScroll;
