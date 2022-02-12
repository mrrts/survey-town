import { useEffect, useState } from "react"

export const useDelayedRender = (delayMs: number, effectDependencies: any[] = []) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    const t = setTimeout(() => {
      setShow(true);
    }, delayMs);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...effectDependencies, setShow, delayMs]);

  return { show };
}