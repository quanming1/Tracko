import { useEffect, useReducer, useRef } from "react";

type StoreWithSubscribe = {
  subscribe: (listener: () => void, keys?: string[]) => () => void;
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
      const storeKeysMap = new Map<string, string[]>(); // key: storeName, value: 被使用过的字段名列表

      accessedKeysRef.current.forEach((fullKey) => {
        const [storeName, propertyName] = fullKey.split(".");
        if (storeName && propertyName) {
          if (!storeKeysMap.has(storeName)) {
            storeKeysMap.set(storeName, []);
          }
          storeKeysMap.get(storeName)!.push(propertyName);
        }
      });

      const unsubscribers: (() => void)[] = [];

      storeKeysMap.forEach((keys, storeName) => {
        const store = stores[storeName];
        if (store) {
          const unsubscribe = store.subscribe(() => {
            forceUpdate();
          }, keys);
          unsubscribers.push(unsubscribe);
        }
      });

      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe());
      };
    });

    accessedKeysRef.current.clear();

    return proxyRef.current;
  };
}
