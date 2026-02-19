import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const scrollPositions = new Map<string, number>();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Save scroll position of the page we're leaving
    if (prevPathname.current !== pathname) {
      scrollPositions.set(prevPathname.current, window.scrollY);
      prevPathname.current = pathname;
    }

    // On back/forward (POP), restore saved position; otherwise scroll to top
    if (navigationType === "POP") {
      const saved = scrollPositions.get(pathname);
      if (saved !== undefined) {
        // Delay slightly to allow DOM to render
        requestAnimationFrame(() => window.scrollTo(0, saved));
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
