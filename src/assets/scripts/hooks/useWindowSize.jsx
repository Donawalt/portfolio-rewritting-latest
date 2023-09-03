import * as React from 'react';
import { getWindow } from '../utils/dom.js'

const getSize = () => {   return {
        innerHeight: getWindow().innerHeight,
        innerWidth: getWindow().innerWidth,
        outerHeight: getWindow().outerHeight,
        outerWidth: getWindow().outerWidth
      };
}

const useWindowSize = () => {
    const [windowSize, setWindowSize] = React.useState({});

    const handleResize = () => {
        setWindowSize(getSize());
    }

    React.useEffect(()=>{
        getWindow().addEventListener("resize", handleResize);
        handleResize()
        return () => {
          getWindow().removeEventListener("resize", handleResize);
        };
    }, [])
    return windowSize
}

export default useWindowSize;