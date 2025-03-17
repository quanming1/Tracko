function memo(Component, compare = shallowEqual) {
  let lastProps = null; // 上一次的 props
  let lastElement = null; // 上一次的渲染结果

  return function MemoComponent(props) {
    // 如果没有变化，直接复用上一次的渲染结果
    if (lastProps !== null && lastElement !== null && compare(lastProps, props)) {
      return lastElement;
    }

    // 如果有变化，重新渲染组件
    lastProps = props;
    lastElement = <Component {...props} />;
    return lastElement;
  };
}

// 默认的浅比较函数
function shallowEqual(objA, objB) {
  if (Object.is(objA, objB)) return true; // 相同引用或值

  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false; // 非对象或 null，直接返回 false
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false; // 属性数量不同

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!Object.prototype.hasOwnProperty.call(objB, key) || !Object.is(objA[key], objB[key])) {
      return false; // 属性不匹配
    }
  }

  return true;
}

export default memo;
