import gsap from "gsap";

const animationMaskYaxis = (elements, ease, afterEase, duration) => {
  if (window.innerWidth >= 768) {
    const easeArray = [ease, afterEase];
    const completeEase = easeArray.join(".");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target,
              {
                opacity: 0,
              },
              {
                opacity: 1,
                ease: `${completeEase}`,
              }
            );
            gsap.fromTo(
              entry.target.children[0].children[0],
              {
                y: 600,
                opacity: 0,
              },
              {
                opacity: 1,
                y: 0,
                duration: duration,
                ease: `${completeEase}`,
                onComplete: () => {
                  entry.target.children[0].style.overflow = "initial";
                },
              }
            );
            gsap.fromTo(
              entry.target.children[1].children[0],
              {
                y: 300,
              },
              {
                y: 0,
                duration: duration,
                ease: `${completeEase}`,
              },
              "<+=25%"
            );
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.8,
      }
    );

    elements.forEach((number) => {
      observer.observe(number);
    });
  } else {
    elements.forEach((number) => {
      gsap.set(number, { opacity: 1 });
    });
  }
};

export const willBeAnimation = (elements) => {
  const black = "#0f0f0f";
  const gray = "#dcdcdc";
  let viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  // Get the Rect of the elements passed as parameters of the function willBeAnimation
  const getElementRect = () => {
    let elementsRect = [];
    elements.forEach((element, index) => {
      elementsRect.push({
        title: element,
        bottom: element.getBoundingClientRect().bottom,
        height: element.getBoundingClientRect().height,
        top: element.getBoundingClientRect().top,
        index: index,
      });
    });
    return elementsRect;
  };

  // Reset the colors of the typeface and the border
  const resetColor = () => {
    const firstElement = getElementRect()[0];
    const lastElement = getElementRect()[elements.length - 1];
    elements.forEach((element) => {
      element.style.color = gray;
      element.style.borderColor = gray;
    });
    // If the bottom of the first element is greater than 0 and if the bottom of the first element is greater than the height of the viewport divided by 2
    if (firstElement.bottom > 0 && firstElement.bottom > viewportHeight / 2) {
      // Then we are above the setion and the first element is in black
      firstElement.title.style.color = black;
      firstElement.title.style.borderColor = black;
    }
    // If the bottom of the last element is greater than 0 and if the bottom of the first element is less than the height of the viewport divided by 2
    if (lastElement.bottom > 0 && lastElement.bottom < viewportHeight / 2) {
      // Then we are below the setion and the last element is in black
      lastElement.title.style.color = black;
      lastElement.title.style.borderColor = black;
    }
  };
  resetColor();

  // Get the element closest to the center of the viewport
  const getNearestElementOfTheCenter = () => {
    let nearestElement;

    // For each element of the array that the "getElementRect" function returns, we check which is the closest to the center
    getElementRect().forEach((element) => {
      if (
        element.bottom - element.height < viewportHeight / 2 &&
        element.bottom - element.height > viewportHeight / 4
      ) {
        nearestElement = element.title;
      } else {
        return;
      }
    });

    return nearestElement;
  };

  // We initialize the animation
  const initAnimation = () => {
    // We get the element closest to the center with the "getNearestElementOfTheCenter" function
    const nearestElement = getNearestElementOfTheCenter();
    // We reset the Colors
    resetColor();
    // We apply the right color
    if (nearestElement) {
      nearestElement.style.color = black;
      nearestElement.style.borderColor = black;
    }
  };

  window.addEventListener("scroll", () => {
    // We update according to the scroll
    initAnimation();
  });
};

export default animationMaskYaxis;
