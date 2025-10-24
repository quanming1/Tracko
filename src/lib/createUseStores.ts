import { useEffect, useReducer, useRef } from "react";

type StoreWithSubscribe = {
  subscribe: (listener: () => void) => () => void;
  [key: string]: any;
};

export function createUseStores<T extends Record<string, StoreWithSubscribe>>(stores: T) {
  return function useStores(): T {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const accessedKeysRef = useRef<Set<string>>(new Set());
    const proxyRef = useRef<T | null>(null);

    if (!proxyRef.current) {
      const createStoreProxy = (storeName: string, store: any): any => {
        return new Proxy(store, {
          get(target, property: string | symbol) {
            if (typeof property === "string" && property !== "subscribe") {
              accessedKeysRef.current.add(`${storeName}.${property}`);
            }

            const value = target[property];

            if (typeof value === "function") {
              return value.bind(target);
            }

            return value;
          },
        });
      };

      const storesProxy = new Proxy(stores, {
        get(target, storeName: string | symbol) {
          if (typeof storeName === "symbol") {
            return target[storeName as any];
          }

          const store = target[storeName];
          return createStoreProxy(storeName, store);
        },
      });

      proxyRef.current = storesProxy as T;
    }

    useEffect(() => {
      const unsubscribers = Object.keys(stores).map((storeName) => {
        return stores[storeName].subscribe(() => {
          forceUpdate();
        });
      });

      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe());
      };
    }, []);

    accessedKeysRef.current.clear();

    return proxyRef.current;
  };
}
