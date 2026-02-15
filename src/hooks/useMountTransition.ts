import { useEffect, useState } from "react";

export function useMountTransition(isMounted: boolean, unmountDelay: number) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isMounted && !shouldRender) {
      setShouldRender(true);
    } else if (!isMounted && shouldRender) {
      timeoutId = setTimeout(() => setShouldRender(false), unmountDelay);
    }

    return () => clearTimeout(timeoutId);
  }, [isMounted, unmountDelay, shouldRender]);

  return shouldRender;
}
