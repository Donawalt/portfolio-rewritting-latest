
import React from "react";

 const useTransitionPage = ({ children, Transition }) => {
  const [support, setSupport] = React.useState(false);

  React.useEffect(() => {
    setSupport(true);
  }, []);

  return support ? <Transition>{children}</Transition> : <>{ children }</>;

  return (<></>);
};

export default useTransitionPage;
