import { useState, useEffect } from "react";

export default function useLoopFlg(enable = true, interval = 2000) {
  const [flag, setFlag] = useState(0);

  useEffect(() => {
    if (!enable) return;
    const timer = setInterval(() => {
      setFlag((prev) => prev + 1);
    }, interval);

    return () => clearInterval(timer);
  }, [enable, interval]);

  return flag;
}
