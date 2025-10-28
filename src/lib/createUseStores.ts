import { useEffect, useReducer, useRef } from "react";

type StoreWithSubscribe = {
  subscribe: (listener: () => void, keys?: string[]) => () => void;
  [key: string]: any;
};

export function createUseStores<T extends Record<string, StoreWithSubscribe>>(
  stores: T,
  config: {
    clearAccessedKeysBeforeRender?: boolean;
  } = {},
) {
  return function useStores(): T {
    const { clearAccessedKeysBeforeRender = true } = config;

    const [, forceUpdate] = useReducer(() => ({}), null);
    const accessedKeysRef = useRef<Set<string>>(new Set());
    const proxyRef = useRef<T | null>(null);

    if (!proxyRef.current) {
      const createStoreProxy = (storeName: string, store: any): any => {
        return new Proxy(store, {
          get(target, property: string | symbol) {
            // subscribe 方法直接返回原始值，不进行追踪和bind操作
            // 因为它被定义为不可配置属性，Proxy必须返回实际值
            if (property === "subscribe") {
              return Reflect.get(target, property);
            }

            if (typeof property === "string") {
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

    if (clearAccessedKeysBeforeRender) {
      accessedKeysRef.current.clear();
    }

    return proxyRef.current;
  };
}
