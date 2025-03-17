/* eslint-disable react/no-unknown-property */
import React, {
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useContext,
  useEffect,
  Fragment,
} from "react";
import { CacheContext } from "./context";
import { createRoot } from "react-dom/client";
import { RootMap } from "./prerender";
import { useUpdate } from "ahooks";

interface CacheDomProps {
  cacheKey: string;
  children: any;
  disabled?: boolean;
  deps?: Record<string, any>;
  /** 缓存命中时的回调 */
  onCacheHit?: () => void;
  /** 缓存未命中时的回调 */
  onCacheMiss?: () => void;

  containerClassName?: string;
  containerStyle?: React.CSSProperties;
}

const FlushCallbacks = new Map<string, (deps: Record<string, any>) => void>(); // 缓存依赖变化时的回调
interface CacheDomRef {}
const PREFIX = "__cache-dom";
const withPrefix = (key: string) => `${PREFIX}-${key}`;

const createContainer = (
  cacheKey: string,
  containerRef: React.RefObject<HTMLDivElement>,
  containerClassName?: string,
  containerStyle?: React.CSSProperties,
) => {
  return (
    <div
      className={`${withPrefix(cacheKey)} ${containerClassName}`}
      cache-dom-container="true"
      ref={containerRef}
      style={containerStyle}
    />
  );
};

// @ts-ignore
const CacheDom = forwardRef<CacheDomRef, CacheDomProps>(function CacheDom(
  {
    cacheKey,
    children: Children,
    disabled = false,
    deps = [],
    onCacheHit,
    onCacheMiss,
    containerClassName,
    containerStyle,
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const context = useContext(CacheContext);
  const { current } = useRef<React.ReactNode>(
    createContainer(cacheKey, containerRef, containerClassName, containerStyle),
  );

  if (!context) {
    throw new Error("CacheDom 必须在 CacheGroup 中使用");
  }
  const handleCacheHit = () => {
    onCacheHit?.();
  };

  const { domCache, rootCache } = context;

  useImperativeHandle(ref, () => ({}));

  // 处理DOM缓存的初始化和命中
  useLayoutEffect(() => {
    if (disabled || !containerRef.current) return;

    if (!domCache.has(cacheKey) && !RootMap.get(cacheKey)) {
      domCache.set(cacheKey, containerRef.current);
      const root = createRoot(containerRef.current);
      rootCache.set(cacheKey, root);
      root.render(<Container cacheKey={cacheKey} Children={Children} />);
      onCacheMiss?.();
    } else {
      // 获取缓存的DOM元素，优先使用组件内缓存
      const cachedElement = domCache.get(cacheKey);
      containerRef.current?.appendChild(cachedElement);

      handleCacheHit();
    }
  }, [cacheKey, disabled]);

  useLayoutEffect(() => {
    FlushCallbacks.get(cacheKey)?.(deps);
  }, Object.values(deps));

  return disabled ? <Children {...deps} /> : current;
});

export { CacheDom };
export type { CacheDomRef, CacheDomProps };

function Container({ Children, cacheKey }: { Children: any; cacheKey: string }) {
  const update = useUpdate();
  const depsRef = useRef<Record<string, any>>({});

  useEffect(() => {
    FlushCallbacks.set(cacheKey, (deps: Record<string, any>) => {
      console.log("更新了", cacheKey);
      depsRef.current = { ...deps };
      update();
    });
    return () => {
      FlushCallbacks.delete(cacheKey);
    };
  }, []);

  return (
    <Fragment>
      <Children {...depsRef.current} />
    </Fragment>
  );
}
