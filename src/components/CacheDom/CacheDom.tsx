/* eslint-disable react/no-unknown-property */
import React, {
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useContext,
  useEffect,
  Fragment,
  ComponentType,
} from "react";
import { CacheContext } from "./context";
import { createRoot } from "react-dom/client";
import { RootMap } from "./prerender";
import { useUpdate } from "ahooks";
import type { ISafeAny } from "../../types";

interface CacheDomProps<T = Record<string, unknown>> {
  cacheKey: string;
  Component: ComponentType<T>;
  disabled?: boolean;
  deps?: T;
  onCacheHit?: () => void;
  onCacheMiss?: () => void;

  containerClassName?: string;
  containerStyle?: React.CSSProperties;
}

const FlushCallbacks = new Map<string, (deps: ISafeAny) => void>(); // 缓存依赖变化时的回调
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
      className={`${withPrefix(cacheKey)} ${containerClassName || ""}`}
      cache-dom-container="true"
      ref={containerRef}
      style={containerStyle}
    />
  );
};

function CacheDomInner<T = Record<string, unknown>>(
  {
    cacheKey,
    Component,
    disabled = false,
    deps = {} as T,
    onCacheHit,
    onCacheMiss,
    containerClassName,
    containerStyle,
  }: CacheDomProps<T>,
  ref: React.ForwardedRef<CacheDomRef>,
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
      root.render(<CacheDomWrapper<T> cacheKey={cacheKey} Component={Component} />);
      onCacheMiss?.();
    } else {
      // 获取缓存的DOM元素，优先使用组件内缓存
      const cachedElement = domCache.get(cacheKey);
      if (cachedElement && containerRef.current) {
        containerRef.current.appendChild(cachedElement);
      }

      handleCacheHit();
    }
  }, [cacheKey, disabled, Component]);

  useLayoutEffect(
    () => {
      FlushCallbacks.get(cacheKey)?.(deps);
    },
    Object.values(deps || {}),
  );

  return disabled ? <Component {...deps} /> : current;
}

const CacheDom = forwardRef(CacheDomInner) as <T = Record<string, unknown>>(
  props: CacheDomProps<T> & { ref?: React.ForwardedRef<CacheDomRef> },
) => React.ReactElement;

export { CacheDom };
export type { CacheDomRef, CacheDomProps };

function CacheDomWrapper<T = Record<string, unknown>>({
  Component,
  cacheKey,
}: {
  Component: ComponentType<T>;
  cacheKey: string;
}) {
  const update = useUpdate();
  const depsRef = useRef<T>({} as T);

  useEffect(() => {
    FlushCallbacks.set(cacheKey, (deps: T) => {
      console.log("更新了", cacheKey);
      depsRef.current = { ...deps };
      update();
    });
    return () => {
      FlushCallbacks.delete(cacheKey);
    };
  }, [cacheKey]);

  return (
    <Fragment>
      <Component {...depsRef.current} />
    </Fragment>
  );
}
