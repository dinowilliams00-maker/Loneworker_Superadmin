import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // this is IMPORTANT
    // force browser to scroll immediately
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    });
  }, [pathname]);

  return null; // when we Get the Route 
}