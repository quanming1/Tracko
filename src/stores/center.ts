import { autorun, IAutorunOptions } from "mobx";
import { useEffect, useState } from "react";
import { stores as allStores, TStores } from "./index";

export function useStore(): TStores {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // 使用 autorun 监听所有 store
    const disposer = autorun(
      () => {
        // 访问所有 store 的属性来建立依赖关系
        const trackObject = (obj: any) => {
          if (!obj || typeof obj !== "object") return;

          Object.keys(obj).forEach((key) => {
            const value = obj[key];
            // 递归追踪嵌套对象
            if (typeof value === "object" && value !== null) {
              trackObject(value);
            }
          });
        };
        // 追踪所有 store
        Object.values(allStores).forEach(trackObject);
        // 强制组件更新
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
