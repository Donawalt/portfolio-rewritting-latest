import $747425b437e121da$import$b4d109667193a62e$2e2bcd8739ae039 from "lenis";
import $im0Rw$react, {useState as $im0Rw$useState, useEffect as $im0Rw$useEffect} from "react";

const $a3e4bd7b8405d372$export$c32a249941905394 = (element)=>{
    const object = element.getBoundingClientRect();
    object.relativeRight = window.innerWidth - object.right;
    object.relativeBottom = window.innerHeight - object.bottom;
    return object;
};
const $a3e4bd7b8405d372$export$795910f5f15a9633 = (element)=>{
    const object = element.getBoundingClientRect();
    return object.top < $a3e4bd7b8405d372$export$38b2d434cce3ea22().innerHeight && object.bottom > 0;
};
const $a3e4bd7b8405d372$export$45a5e7f76e0caa8d = (element)=>{
    return typeof HTMLElement === "object" ? element instanceof HTMLElement : element && typeof element === "object" && element !== null && element.nodeType === 1 && typeof element.nodeName === "string";
};
async function $a3e4bd7b8405d372$export$e66b41dc920d27ac() {
    let ready = await $a3e4bd7b8405d372$export$f65ca476c09acec0().fonts.ready;
}
const $a3e4bd7b8405d372$export$f7be23f196c4b448 = (props, customFunction)=>{
    let { triggerElement: triggerElement , timeline: timeline , end: end , pin: pin , pinEnd: pinEnd  } = props;
    // In this function we would like to create the behavior of the ScrollTrigger
    // First we init the behavior
    let pinElement = false;
    let initialHeight = false;
    triggerElement = $a3e4bd7b8405d372$export$45a5e7f76e0caa8d(triggerElement) ? triggerElement : $a3e4bd7b8405d372$export$f65ca476c09acec0().querySelector(triggerElement);
    initialHeight = $a3e4bd7b8405d372$export$c32a249941905394(triggerElement).height;
    triggerElement.style.height = initialHeight + end + "px";
    triggerElement.style.position = "relative";
    let rectElement = ()=>$a3e4bd7b8405d372$export$c32a249941905394(triggerElement);
    pinElement = pin ? triggerElement.querySelector(".pin") : false;
    $a3e4bd7b8405d372$export$f65ca476c09acec0().addEventListener("scroll", ()=>{
        if (pinElement && -rectElement().top >= 0) {
            if (!pinEnd) {
                if (-rectElement().top <= rectElement().height - $a3e4bd7b8405d372$export$c32a249941905394(pinElement).height) {
                    // pinElement.style.transform = `translateY(${- rectElement().top}px)`;
                    pinElement.style.position = "fixed";
                    pinElement.style.transform = ``;
                    pinElement.style.top = "0px";
                    pinElement.style.left = "0px";
                } else {
                    pinElement.style.transform = `translateY(${rectElement().height - $a3e4bd7b8405d372$export$c32a249941905394(pinElement).height}px)`;
                    pinElement.style.position = ``;
                }
            }
            if (pinEnd) {
                pinElement.style.position = "fixed";
                pinElement.style.transform = ``;
                pinElement.style.top = "0px";
                pinElement.style.left = "0px";
            }
        } else if (pinElement) {
            pinElement.style.transform = ``;
            pinElement.style.position = ``;
        }
        if (customFunction) customFunction({
            fullProgress: -rectElement().top / rectElement().height,
            progress: -rectElement().top / (rectElement().height - window.innerHeight)
        });
    });
};
const $a3e4bd7b8405d372$export$4bc4513f7604a920 = (element)=>{
    // Récupération de la valeur de la propriété "transform" de l'élément
    const transform = window.getComputedStyle(element).transform;
    // Création de l'objet de résultat
    const result = {};
    // Si la propriété "transform" existe et n'est pas vide
    if (transform && transform !== "none") {
        // Séparation des différentes transformations
        const transforms = transform.match(/\(([^)]+)\)/)[1].split(", ");
        return {
            transformX: transforms[4],
            transformY: transforms[5]
        };
    }
    // Renvoi de l'objet de résultat
    return result;
};
const $a3e4bd7b8405d372$export$f65ca476c09acec0 = ()=>{
    let currentDOM;
    let location = window.location.host;
    switch(location){
        case "localhost:3333":
            currentDOM = document.querySelector('iframe[data-preview="true"]').contentWindow.document;
            break;
        case "scc-france-sanity.netlify.app":
            currentDOM = document.querySelector('iframe[data-preview="true"]').contentWindow.document;
            break;
        default:
            currentDOM = document;
            break;
    }
    return currentDOM;
};
const $a3e4bd7b8405d372$export$38b2d434cce3ea22 = ()=>{
    let currentWindow;
    let location = window.location.host;
    let iframe;
    switch(location){
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
};



/**
 * @author Émilien VIVIER
 * @brief React hook which run callBack if click outside component
 * @param ref of the component we want to listen
 * @param callBack to run if click outside
 */ 
const $c9059827bf7375f4$export$71b2224f1ce5e08e = (ref, callBack)=>{
    (0, $im0Rw$react).useEffect(()=>{
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) callBack();
        }
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>{
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [
        ref
    ]);
};



const $ace406c02c2a8eda$var$useMediaQuery = (query)=>{
    const [matches, setMatches] = (0, $im0Rw$useState)(false);
    (0, $im0Rw$useEffect)(()=>{
        const media = window.matchMedia(query);
        if (media.matches !== matches) setMatches(media.matches);
        const listener = ()=>setMatches(media.matches);
        window.addEventListener("resize", listener);
        return ()=>window.removeEventListener("resize", listener);
    }, [
        matches,
        query
    ]);
    return matches;
};
var $ace406c02c2a8eda$export$2e2bcd8739ae039 = $ace406c02c2a8eda$var$useMediaQuery;



const $3fd51aaef0a31798$var$useMutationObserver = (ref, callback, options = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true
})=>{
    (0, $im0Rw$react).useEffect(()=>{
        if (ref.current) {
            const observer = new MutationObserver(callback);
            observer.observe(ref.current, options);
            return ()=>observer.disconnect();
        }
    }, [
        callback,
        options
    ]);
};
var $3fd51aaef0a31798$export$2e2bcd8739ae039 = $3fd51aaef0a31798$var$useMutationObserver;


/**
 * @author Donaël Walter
 * @brief React hook who manage the logic search from an json endpoint return the result
 * @param endpoint
 * @param input
 */ 
function $296be1f61302121e$export$3a89f8d6f6bf6c9f(p1, p2, t) {
    return p1 + (p2 - p1) * t;
}
function $296be1f61302121e$export$c07234257a03d5e9(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
function $296be1f61302121e$export$89e29e4ab65e70a9(start, end, value) {
    return start * (1.0 - value) + end * value;
}
function $296be1f61302121e$export$7d15b64cf5a3a4c4(min, max, number) {
    return Math.max(min, Math.min(number, max));
}
function $296be1f61302121e$export$4385e60b38654f68(min, max) {
    return Math.random() * (max - min) + min;
}
function $296be1f61302121e$export$b944ac7a98f38130(x, total) {
    return total * x / 100;
}
function $296be1f61302121e$export$8a3be89cd00fc7e6(x, total) {
    return x * 100 / total;
}
function $296be1f61302121e$export$b6b410691a49e495(a, b, c) {
    return c * b / a;
}
function $296be1f61302121e$export$edf8ac017ca4b6f0(eValue, rValue) {
    if (!rValue) return eValue && eValue;
    return eValue ? eValue : rValue;
}
function $296be1f61302121e$export$fc99885b7e473d08(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}
function $296be1f61302121e$export$2e2262a44ac61957(arr) {
    return arr.filter((item, index)=>arr.indexOf(item) === index);
}
function $296be1f61302121e$export$536f0b5b8273277(arr) {
    return JSON.parse(JSON.stringify(arr));
}


const $8da6c32b8f26f7a2$export$bd221a7c56b93941 = (endpoint, input)=>{
    const [endpointsResults, setEndPointResults] = (0, $im0Rw$useState)({});
    const [searchResults, setSearchResults] = (0, $im0Rw$useState)([]);
    const [isLoading, setIsLoading] = (0, $im0Rw$useState)(false);
    const [value, setValue] = (0, $im0Rw$useState)("");
    const handleInputChange = (event, type)=>{
        let value = event.target.value ? event.target.value : "";
        setValue(value);
        endpointsResults.pages.forEach((el)=>{
            el.lvl = null;
        });
        setTimeout(()=>{
            if (endpointsResults.priority && value.length > 0) {
                let resultsArray = [];
                for(let index = 0; index < endpointsResults.priority.length; index++){
                    const element = endpointsResults.priority[index];
                    let currentResults = [
                        ...endpointsResults.pages
                    ].filter((property)=>{
                        const check = ()=>{
                            return property[element] ? property[element].toLowerCase().includes(value.toLowerCase()) : false;
                        };
                        if (!property.lvl && check()) property.lvl = element;
                        return check();
                    });
                    resultsArray = [
                        ...resultsArray,
                        ...currentResults
                    ];
                    resultsArray = (0, $296be1f61302121e$export$2e2262a44ac61957)(resultsArray);
                    setSearchResults(resultsArray);
                }
            } else setSearchResults([]);
        }, 50);
    };
    (0, $im0Rw$useEffect)(()=>{
        // set the state to loading
        setIsLoading(true);
        // fetch the data we need
        fetch(endpoint).then((response)=>response.json()).then((data)=>{
            // set the enpointsResults
            setEndPointResults(data);
            setEndPointResults((data)=>{
                return data;
            });
            // set the loading state to false
            setIsLoading(false);
        }).catch(()=>{
            // error
            // set the error value
            // set the loading false
            setIsLoading(false);
        });
    }, []);
    (0, $im0Rw$useEffect)(()=>{
        if (input && input.current) {
            input.current.addEventListener("keyup", (event)=>{
                handleInputChange(event, "keyup");
            });
            // inititalise input event
            input.current.addEventListener("keydown", (event)=>{
                handleInputChange(event, "keydown");
            });
            // onChange
            input.current.addEventListener("change", (event)=>{
                handleInputChange(event, "change");
            });
            // onBlur
            input.current.addEventListener("blur", (event)=>{
                handleInputChange(event, "blur");
            });
        }
    }, [
        endpointsResults,
        input
    ]);
    return {
        state: isLoading,
        initial: endpointsResults,
        results: searchResults,
        value: value
    };
};
var $8da6c32b8f26f7a2$export$2e2bcd8739ae039 = $8da6c32b8f26f7a2$export$bd221a7c56b93941;




const $59dcb4b8791a45e2$var$eventBus = {
    on (event, callback) {
        document.addEventListener(event, (e)=>callback(e.detail));
    },
    dispatch (event, data) {
        document.dispatchEvent(new CustomEvent(event, {
            detail: data
        }));
    },
    remove (event, callback) {
        document.removeEventListener(event, callback);
    }
};
var $59dcb4b8791a45e2$export$2e2bcd8739ae039 = $59dcb4b8791a45e2$var$eventBus;


function $197ccff77f9a03b9$var$useSmoothScroll() {
    const [lenis, setLenis] = (0, $im0Rw$react).useState(null);
    (0, $im0Rw$react).useLayoutEffect(()=>{
        if (window.lenis) return window.lenis;
        const l = new (0, $747425b437e121da$import$b4d109667193a62e$2e2bcd8739ae039)({
            duration: 1.2,
            easing: (t)=>Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            smoothTouch: false,
            touchMultiplier: 2
        });
        setLenis(l);
        const scrollFn = (time)=>{
            l.raf(time);
            requestAnimationFrame(scrollFn);
        };
        requestAnimationFrame(scrollFn);
        window.lenis = l;
        (0, $59dcb4b8791a45e2$export$2e2bcd8739ae039).dispatch("lenisLoaded", {
            isLoaded: true
        });
        return lenis?.destroy();
    }, []);
    return lenis;
}
var $197ccff77f9a03b9$export$2e2bcd8739ae039 = $197ccff77f9a03b9$var$useSmoothScroll;




const $20868f24b329f9e0$var$getSize = ()=>{
    return {
        innerHeight: (0, $a3e4bd7b8405d372$export$38b2d434cce3ea22)().innerHeight,
        innerWidth: (0, $a3e4bd7b8405d372$export$38b2d434cce3ea22)().innerWidth,
        outerHeight: (0, $a3e4bd7b8405d372$export$38b2d434cce3ea22)().outerHeight,
        outerWidth: (0, $a3e4bd7b8405d372$export$38b2d434cce3ea22)().outerWidth
    };
};
const $20868f24b329f9e0$var$useWindowSize = ()=>{
    const [windowSize, setWindowSize] = $im0Rw$useState({});
    const handleResize = ()=>{
        setWindowSize($20868f24b329f9e0$var$getSize());
    };
    $im0Rw$useEffect(()=>{
        (0, $a3e4bd7b8405d372$export$38b2d434cce3ea22)().addEventListener("resize", handleResize);
        handleResize();
        return ()=>{
            (0, $a3e4bd7b8405d372$export$38b2d434cce3ea22)().removeEventListener("resize", handleResize);
        };
    }, []);
    return windowSize;
};
var $20868f24b329f9e0$export$2e2bcd8739ae039 = $20868f24b329f9e0$var$useWindowSize;


const $747425b437e121da$var$gongju = {
    getRectangle: $a3e4bd7b8405d372$export$c32a249941905394,
    isVisible: $a3e4bd7b8405d372$export$795910f5f15a9633,
    isElement: $a3e4bd7b8405d372$export$45a5e7f76e0caa8d,
    isTypoReady: $a3e4bd7b8405d372$export$e66b41dc920d27ac,
    scrollTrigger: $a3e4bd7b8405d372$export$f7be23f196c4b448,
    getTransformProperties: $a3e4bd7b8405d372$export$4bc4513f7604a920,
    getDocument: $a3e4bd7b8405d372$export$f65ca476c09acec0,
    getWindow: $a3e4bd7b8405d372$export$38b2d434cce3ea22,
    useOutsideClick: $c9059827bf7375f4$export$71b2224f1ce5e08e,
    useMediaQuery: $ace406c02c2a8eda$export$2e2bcd8739ae039,
    useMutationObserver: $3fd51aaef0a31798$export$2e2bcd8739ae039,
    useSearch: $8da6c32b8f26f7a2$export$2e2bcd8739ae039,
    useSmoothScroll: $197ccff77f9a03b9$export$2e2bcd8739ae039,
    useWindowSize: $20868f24b329f9e0$export$2e2bcd8739ae039,
    lenis: $747425b437e121da$import$b4d109667193a62e$2e2bcd8739ae039
};
var $747425b437e121da$export$2e2bcd8739ae039 = $747425b437e121da$var$gongju;


export {$747425b437e121da$export$2e2bcd8739ae039 as default, $a3e4bd7b8405d372$export$38b2d434cce3ea22 as getWindow, $a3e4bd7b8405d372$export$f65ca476c09acec0 as getDocument, $a3e4bd7b8405d372$export$4bc4513f7604a920 as getTransformProperties, $a3e4bd7b8405d372$export$f7be23f196c4b448 as scrollTrigger, $a3e4bd7b8405d372$export$c32a249941905394 as getRectangle, $a3e4bd7b8405d372$export$795910f5f15a9633 as isVisible, $a3e4bd7b8405d372$export$45a5e7f76e0caa8d as isElement, $a3e4bd7b8405d372$export$e66b41dc920d27ac as isTypoReady, $c9059827bf7375f4$export$71b2224f1ce5e08e as useOutsideClick, $ace406c02c2a8eda$export$2e2bcd8739ae039 as useMediaQuery, $3fd51aaef0a31798$export$2e2bcd8739ae039 as useMutationObserver, $8da6c32b8f26f7a2$export$2e2bcd8739ae039 as useSearch, $197ccff77f9a03b9$export$2e2bcd8739ae039 as useSmoothScroll, $20868f24b329f9e0$export$2e2bcd8739ae039 as useWindowSize, $747425b437e121da$import$b4d109667193a62e$2e2bcd8739ae039 as lenis};
//# sourceMappingURL=gongju-es.js.map
