/**
 * @author Donaël Walter
 * @brief React hook who manage the logic search from an json endpoint return the result
 * @param endpoint
 * @param input
 */

import { useState, useEffect } from "react";
import { removeDuplicates } from "../utils/math";

export const useSearch = (endpoint, input) => {
  const [endpointsResults, setEndPointResults] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');

  const handleInputChange = (event, type) => {
    let value = event.target.value ? event.target.value : "";
    setValue(value);
    endpointsResults.pages.forEach((el) => {el.lvl = null});
    setTimeout(() => {

      if (endpointsResults.priority && value.length > 0) {
        let resultsArray = [];
        for (let index = 0; index < endpointsResults.priority.length; index++) {
          const element = endpointsResults.priority[index];
          let currentResults = [...endpointsResults.pages].filter(
            (property) => {
              const check = () => {
                return property[element]
                  ? property[element]
                      .toLowerCase()
                      .includes(value.toLowerCase())
                  : false;
              };

              if (!property.lvl && check()) {
                property.lvl = element;
              }

              return check();
            }
          );

          resultsArray = [...resultsArray, ...currentResults];
          resultsArray = removeDuplicates(resultsArray);
          setSearchResults(resultsArray);
        }
      } else {
        setSearchResults([]);
      }
    }, 50);
  };

  useEffect(() => {
    // set the state to loading
    setIsLoading(true);
    // fetch the data we need
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        // set the enpointsResults
        setEndPointResults(data);
        setEndPointResults((data) => {
          return data;
        });
        // set the loading state to false
        setIsLoading(false);
      })
      .catch(() => {
        // error
        // set the error value
        // set the loading false
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (input && input.current) {
      input.current.addEventListener("keyup", (event) => {
        handleInputChange(event, "keyup");
      });
      // inititalise input event
      input.current.addEventListener("keydown", (event) => {
        handleInputChange(event, "keydown");
      });
      // onChange
      input.current.addEventListener("change", (event) => {
        handleInputChange(event, "change");
      });
      // onBlur
      input.current.addEventListener("blur", (event) => {
        handleInputChange(event, "blur");
      });
    }
  }, [endpointsResults, input]);

  return {
    state: isLoading,
    initial: endpointsResults,
    results: searchResults,
    value
  };
};

export default useSearch;
