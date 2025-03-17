/* eslint-disable no-unsafe-finally */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { createRoot, Root } from 'react-dom/client';

const originalRemoveChild = Node.prototype.removeChild;

// @ts-ignore
Node.prototype.removeChild = function (child: ISafeAny) {
  let res = undefined;
  try {
    res = originalRemoveChild.call(this, child);
    child.remove();
  } catch (error) {
    try {
      child.remove();
    } finally {
    }
  } finally {
    return res;
  }
};

let id = 0;

// 预渲染根实例
export const RootMap = new Map<string, { container: HTMLElement; rootInstance: Root }>();

export namespace CacheDomHelper {
  const genRoot = () => {
    const container = document.createElement('div');
    container.setAttribute(`data-manmade-container`, 'true');
    container.setAttribute(`data-index`, `${id++}`);
    const rootInstance = createRoot(container);

    return {
      container,
      rootInstance
    };
  };

  export function prerender(reactNode: React.ReactNode, cacheKey: string) {
    const { rootInstance, container } = genRoot();
    rootInstance.render(reactNode);
    RootMap.set(cacheKey, { rootInstance, container });

    return {
      rootInstance,
      container
    };
  }

  export function removeCacheByCacheKey(cacheKey: string) {
    try {
      const cacheItem = RootMap.get(cacheKey);
      RootMap.delete(cacheKey);

      if (cacheItem) {
        try {
          requestIdleCallback(() => {
            cacheItem.rootInstance.unmount();
            cacheItem.container.remove();
          });
        } catch (error) {}
      }
    } catch (error) {
      console.error(`[removeCacheByCacheKey] 删除预渲染缓存失败，cacheKey为：${cacheKey}`, error);
    }
  }

  // 清除预渲染缓存
  export const clearPrerenderCache = () => {
    Array.from(RootMap.keys()).forEach((key) => {
      removeCacheByCacheKey(key);
    });

    RootMap.clear();
  };
}
