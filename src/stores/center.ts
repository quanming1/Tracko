import { autorun, IAutorunOptions, reaction } from "mobx";
import { useEffect, useState, useCallback, useRef } from "react";
import { stores as allStores, TStores } from "./index";

// 定义选择器函数类型
type Selector<T> = (stores: TStores) => T;

// 定义多选择器的类型
type MultiSelector<T> = {
  [K in keyof T]: (stores: TStores) => T[K];
};

export function useStore(): TStores;
export function useStore<T>(selector: Selector<T>): T;
export function useStore<T extends Record<string, any>>(selectors: MultiSelector<T>): T;
export function useStore<T>(selectorOrSelectors?: Selector<T> | MultiSelector<T>): TStores | T {
  const [state, setState] = useState<T | TStores>(() => {
    if (!selectorOrSelectors) return allStores;
    if (typeof selectorOrSelectors === "function") return selectorOrSelectors(allStores);
    const result = {} as T;
    for (const key in selectorOrSelectors) {
      result[key] = selectorOrSelectors[key](allStores);
    }
    return result;
  });

  useEffect(() => {
    // 处理多选择器的情况
    if (selectorOrSelectors && typeof selectorOrSelectors === "object") {
      const disposers = Object.entries(selectorOrSelectors as MultiSelector<T>).map(
        ([key, selector]) =>
          reaction(
            // @ts-ignore
            () => selector(allStores),
            (newValue) => {
              setState((prev: any) => ({
                ...prev,
                [key]: newValue,
              }));
            },
            {
              fireImmediately: false,
              name: `StoreMultiTracker_${key}`,
            },
          ),
      );

      return () => disposers.forEach((disposer) => disposer());
    }

    // 处理单选择器或无选择器的情况
    if (selectorOrSelectors && typeof selectorOrSelectors === "function") {
      return reaction(
        () => selectorOrSelectors(allStores),
        (newValue) => {
          setState(newValue);
        },
        {
          fireImmediately: false,
          name: "StoreSingleTracker",
        },
      );
    }

    // 处理无选择器的情况
    return autorun(
      () => {
        const trackObject = (obj: unknown) => {
          if (!obj || typeof obj !== "object") return;
          Object.values(obj).forEach(trackObject);
        };
        Object.values(allStores).forEach(trackObject);
        setState(allStores);
      },
      {
        name: "StoreFullTracker",
      } as IAutorunOptions,
    );
  }, [selectorOrSelectors]);

  return state;
}
