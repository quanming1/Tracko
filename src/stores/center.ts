import { autorun, IAutorunOptions } from "mobx";
import { useEffect, useState } from "react";
import { stores as allStores, TStores } from "./index";

export function useStore(): TStores {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const disposer = autorun(
      () => {
        const trackObject = (obj: unknown) => {
          if (!obj || typeof obj !== "object") return;
          Object.values(obj).forEach(trackObject);
        };
        Object.values(allStores).forEach(trackObject);
        forceUpdate({});
      },
      {
        delay: 0,
        name: "StoreTracker",
      } as IAutorunOptions,
    );

    return () => disposer();
  }, []);

  return allStores;
}
