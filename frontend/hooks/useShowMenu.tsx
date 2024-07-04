import { useEffect, useRef, useState } from "react";

export default function useShowMenu(initialIsVisible: boolean) {
  const [showMenu, setShowMenu] = useState(initialIsVisible);
  const ref = useRef();

  const handleClickOutside = (event: MouseEvent) => {
    // @ts-ignore
    if (ref.current && !ref.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, showMenu, setShowMenu };
}
