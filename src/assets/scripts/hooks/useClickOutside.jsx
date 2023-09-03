/**
 * @author Émilien VIVIER
 * @brief React hook which run callBack if click outside component
 * @param ref of the component we want to listen
 * @param callBack to run if click outside
 */

import React from "react";

export const useOutsideClick = (ref, callBack) => {
  React.useEffect(() => {

    function handleClickOutside(event) {
      
      if (ref.current && !ref.current.contains(event.target)) {
          callBack()
      }

    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

