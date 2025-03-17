/* eslint-disable react/no-unknown-property */
import React, { useLayoutEffect, useRef, useContext, useEffect, ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { useUpdate, useUpdateLayoutEffect } from "ahooks";

import { CacheContext } from "./context";
import type { ISafeAny } from "../../types";

const PREFIX = "__cache-dom";
const withPrefix = (key: string): string => `${PREFIX}-${key}`;
const FlushCallbacks = new Map<string, (deps: ISafeAny) => void>();

interface CacheDomProps<T = Record<string, unknown>> {
  cacheKey: string; // 缓存key
  Component: ComponentType<T>; // 组件
  disabled?: boolean; // 是否禁用缓存
  props?: T; // 依赖
  onCacheHit?: () => void; // 缓存命中回调
  onCacheMiss?: () => void; // 缓存未命中回调
  containerClassName?: string; // 容器类名
  containerStyle?: React.CSSProperties; // 容器样式
}

/**
 * 创建缓存容器
 */
const createContainer = (
  cacheKey: string,
  containerRef: React.RefObject<HTMLDivElement>,
  containerClassName?: string,
  containerStyle?: React.CSSProperties,
): React.ReactNode => {
  return (
    <div
      className={`${withPrefix(cacheKey)} ${containerClassName || ""}`}
      cache-dom-container="true"
      ref={containerRef}
      style={containerStyle}
    />
  );
};

function CacheDomWrapper<T = Record<string, unknown>>({
  Component,
  cacheKey,
}: {
  Component: ComponentType<T>;
  cacheKey: string;
}): React.ReactElement {
  const update = useUpdate();
  const depsRef = useRef<T>({} as T);

  useEffect(() => {
    FlushCallbacks.set(cacheKey, (deps: T) => {
      depsRef.current = { ...deps };
      update();
    });

    return () => {
      FlushCallbacks.delete(cacheKey);
    };
  }, [cacheKey, update]);

  return <Component {...depsRef.current} />;
}

/**
 * CacheDom组件
 */
function CacheDom<T = Record<string, unknown>>({
  cacheKey,
  Component,
  disabled = false,
  props = {} as T,
  onCacheHit,
  onCacheMiss,
  containerClassName,
  containerStyle,
}: CacheDomProps<T>): React.ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const context = useContext(CacheContext);
  const { current } = useRef<React.ReactNode>(
    createContainer(cacheKey, containerRef, containerClassName, containerStyle),
  );

  if (!context) {
    throw new Error("CacheDom 必须在 CacheGroup 中使用");
  }

  const { domCache, rootCache } = context;

  useLayoutEffect(() => {
    if (disabled || !containerRef.current) return;

    if (!domCache.has(cacheKey)) {
      domCache.set(cacheKey, containerRef.current);
      const root = createRoot(containerRef.current);
      rootCache.set(cacheKey, root);
      root.render(<CacheDomWrapper<T> cacheKey={cacheKey} Component={Component} />);
      onCacheMiss?.();
    } else {
      const cachedElement = domCache.get(cacheKey);
      if (cachedElement && containerRef.current) {
        containerRef.current.appendChild(cachedElement);
      }
      onCacheHit?.();
    }
  }, [cacheKey, disabled]);

  useUpdateLayoutEffect(
    () => {
      FlushCallbacks.get(cacheKey)?.(props);
    },
    Object.values(props || {}),
  );

  return disabled ? <Component {...props} /> : current;
}

export { CacheDom };
export type { CacheDomProps };
