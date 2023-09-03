export const getRectangle = (element) => {
  const object = element.getBoundingClientRect();
  object.relativeRight = window.innerWidth - object.right;
  object.relativeBottom = window.innerHeight - object.bottom;

  return object;
};

export const isVisible = (element) => {
  const object = element.getBoundingClientRect();
  return object.top < window.innerHeight && object.bottom > 0;
};

export const isElement = (element) => {
    return (
      typeof HTMLElement === "object" ? element instanceof HTMLElement : //DOM2
      element && typeof element === "object" && element !== null && element.nodeType === 1 && typeof element.nodeName==="string"
  ); 
}

export async function isTypoReady() {
  let ready = await getDocument().fonts.ready;
}

export const scrollTrigger = (props, customFunction) => {
  let { triggerElement, timeline, end, pin, pinEnd } = props;
  // In this function we would like to create the behavior of the ScrollTrigger
  // First we init the behavior
  let pinElement = false;
  let initialHeight = false;
  triggerElement = isElement(triggerElement) ? triggerElement : getDocument().querySelector(triggerElement);
  initialHeight = getRectangle(triggerElement).height;
  triggerElement.style.height = initialHeight + end + "px";
  triggerElement.style.position = "relative";

  let rectElement = () => getRectangle(triggerElement);
  pinElement = pin ? triggerElement.querySelector(".pin") : false;

  getDocument().addEventListener("scroll", () => {
    if (pinElement && -rectElement().top >= 0) {
      if (!pinEnd) {
        if (
          -rectElement().top <=
          rectElement().height - getRectangle(pinElement).height
        ) {
          // pinElement.style.transform = `translateY(${- rectElement().top}px)`;
          pinElement.style.position = "fixed";
          pinElement.style.transform = ``;
          pinElement.style.top = "0px";
          pinElement.style.left = "0px";
        } else {
          pinElement.style.transform = `translateY(${rectElement().height - getRectangle(pinElement).height
            }px)`;
          pinElement.style.position = ``;
        }
      }
      if (pinEnd) {
        pinElement.style.position = "fixed";
        pinElement.style.transform = ``;
        pinElement.style.top = "0px";
        pinElement.style.left = "0px";
      }
    } else {
      if (pinElement) {
        pinElement.style.transform = ``;
        pinElement.style.position = ``;
      }
    }

    if (customFunction) {
      customFunction({
        fullProgress: -rectElement().top / rectElement().height,
        progress:
          -rectElement().top / (rectElement().height - window.innerHeight),
      });
    }
  });
};

export const getTransformProperties = (element) => {
  // Récupération de la valeur de la propriété "transform" de l'élément
  const transform = window.getComputedStyle(element).transform;

  // Création de l'objet de résultat
  const result = {};

  // Si la propriété "transform" existe et n'est pas vide
  if (transform && transform !== 'none') {
    // Séparation des différentes transformations
    const transforms = transform.match(/\(([^)]+)\)/)[1].split(', ');
    return {
      transformX: transforms[4],
      transformY: transforms[5]
    };
  }

  // Renvoi de l'objet de résultat
  return result;
}

export const getDocument = () => {
  let currentDOM;
  let location = window.location.host;
  switch (location) {
    case "localhost:3333":
      currentDOM = document.querySelector('iframe[data-preview="true"]')
        .contentWindow.document;
      break;

    case "scc-france-sanity.netlify.app":
      currentDOM = document.querySelector('iframe[data-preview="true"]')
        .contentWindow.document;
      break;

    default:
      currentDOM = document;
      break;
  }

  return currentDOM;
};

export const getWindow = () => {
  let currentWindow;
  let location = window.location.host;
  let iframe;
  switch (location) {
    case "localhost:3333":
      iframe = document.querySelector('iframe[data-preview="true"]');
      currentWindow = iframe ? iframe.contentWindow : window;
      break;

    case "scc-france-sanity.netlify.app":
      iframe = document.querySelector('iframe[data-preview="true"]');
      currentWindow = iframe ? iframe.contentWindow : window;
      break;

    default:
      currentWindow = window;
      break;
  }

  return currentWindow;
}