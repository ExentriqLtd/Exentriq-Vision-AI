import { useWindowWidth } from "@wojtekmaj/react-hooks";
import { useEffect, useState } from "react";

export const TABLET_BREAKPOINT = 1024;

export default function useIsTablet() {
  const windowWidth = useWindowWidth();
  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    if ((windowWidth || 0) < TABLET_BREAKPOINT) {
      setIsTablet(true);
    } else {
      setIsTablet(false);
    }
  }, [windowWidth]);

  return { isTablet };
}
