/* eslint-disable react-hooks/exhaustive-deps */
import * as _ from "lodash-es";
import React, { memo, useContext, useEffect } from "react";
import { prefixVLClassname, VirtualListContext } from "./virtual-list";

interface VLItemWrapProps {
  children: React.ReactNode;
  uukey: string;
  index: number;
  style?: React.CSSProperties;
  extraofBottom?: boolean;
  forceRender?: boolean;
}

// function throttle_immediate<T extends Function>(fun: T, wait: number) {
//   let timeout: ISafeAny = null;
//   return function (...args: ISafeAny[]) {
//     if (!timeout) {
//       fun(...args);
//       timeout = setTimeout(() => {
//         timeout = null;
//       }, wait);
//     }
//   };
// }
export const VLItemWrap = memo(
  function ({
    children,
    style = {},
    index,
    extraofBottom = false,
    forceRender = false,
  }: VLItemWrapProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    const { changeHeight } = useContext(VirtualListContext);
    useEffect(() => {
      if (ref.current) {
        const observer = new ResizeObserver(() => {
          if (ref.current) {
            changeHeight(index, ref.current.offsetHeight);
          }
        });
        observer.observe(ref.current!);
        return () => {
          observer.disconnect();
        };
      }
    }, [ref.current]);

    return (
      <div
        // 底部额外渲染
        {...(extraofBottom ? { "data-extra-of-bottom": true } : {})}
        // 强制渲染
        {...(forceRender ? { "data-force-render": true } : {})}
        ref={ref}
        style={style}
        id={extraofBottom ? undefined : prefixVLClassname("item-wrap")}
        data-virtual-list-row-index={index}
      >
        {children}
      </div>
    );
  },
  (pre, cur) => {
    return pre.uukey === cur.uukey;
  },
);
