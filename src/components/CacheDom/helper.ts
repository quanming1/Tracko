import { LRUCache } from "./LRUCache";

/**
 * 合并两个LRUCache实例，生成一个新的LRUCache实例
 */
export function mergeLRUCaches<K extends string, V>(
  source1: LRUCache<K, V>,
  source2: LRUCache<K, V>,
): LRUCache<K, V> {
  const mergedCache = new LRUCache<K, V>(source1.capacity + source2.capacity);

  for (const key of source1.keys()) {
    mergedCache.set(key, source1.get(key)!);
  }

  for (const key of source2.keys()) {
    mergedCache.set(key, source2.get(key)!);
  }

  return mergedCache;
}

/**
 * 检查两个LRUCache实例是否相等
 */
export function isLRUCacheEqual<K extends string, V>(
  cache1: LRUCache<K, V>,
  cache2: LRUCache<K, V>,
): boolean {
  if (cache1.size !== cache2.size) {
    return false;
  }

  let isEqual = true;
  for (const key of cache1.keys()) {
    if (!cache2.has(key) || cache2.get(key) !== cache1.get(key)) {
      isEqual = false;
      break;
    }
  }

  return isEqual;
}
