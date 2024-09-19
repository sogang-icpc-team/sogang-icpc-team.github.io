import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollTopOnRouteChange = () => {
  const location = useLocation();
  useEffect(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [location]);
  return <></>;
};
