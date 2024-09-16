import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "./locomotive-scroll.css";

function useLocomotiveScroll() {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
      });
  
      // Clean up on unmount
      return () => {
        scroll.destroy();
      };
    }
  }, []);
  return scrollRef;
};

export default useLocomotiveScroll;
