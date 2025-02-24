import { autorun, IAutorunOptions } from "mobx";
import { useEffect, useState } from "react";
import { stores as allStores, TStores } from "./index";

// 定义选择器函数类型
type Selector<T> = (stores: TStores) => T;

export function useStore(): TStores;
export function useStore<T>(selector: Selector<T>): T;
export function useStore<T>(selector?: Selector<T>): TStores | T {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const disposer = autorun(
      () => {
        if (selector) {
          // 如果提供了选择器，只追踪选择器返回的数据
          selector(allStores);
          forceUpdate({});
        } else {
          // 原有的完整追踪逻辑
          const trackObject = (obj: unknown) => {
            if (!obj || typeof obj !== "object") return;
            Object.values(obj).forEach(trackObject);
          };
          Object.values(allStores).forEach(trackObject);
          forceUpdate({});
        }
      },
      {
        delay: 0,
        name: "StoreTracker",
      } as IAutorunOptions,
    );

    return () => disposer();
  }, [selector]);

  return selector ? selector(allStores) : allStores;
}
