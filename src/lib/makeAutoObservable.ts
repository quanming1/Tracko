type Listener = () => void;

type UnsubscribeFn = () => void;

export interface ObservableValue {
  subscribe: (listener: Listener, keys?: string[]) => UnsubscribeFn;
}

const computedStack: ComputedValue[] = [];

const getCurrentComputed = (): ComputedValue | undefined => {
  return computedStack[computedStack.length - 1];
};

class ComputedValue {
  private cachedValue: unknown;
  private dirty: boolean = true;
  private deps: Set<Set<ComputedValue>> = new Set();
  private dependents: Set<ComputedValue> = new Set();
  private observableManager: ObservableManager;
  private fieldName: string;
  private getter: () => unknown;

  constructor(options: {
    fieldName: string;
    getter: () => unknown;
    observableManager: ObservableManager;
  }) {
    this.fieldName = options.fieldName;
    this.getter = options.getter;
    this.observableManager = options.observableManager;
  }

  get value(): unknown {
    if (computedStack.includes(this)) {
      console.error("可能出现Getter递归调用");
    }

    const activeComputed = getCurrentComputed();
    if (activeComputed && activeComputed !== this) {
      activeComputed.addDep(this.dependents);
    }

    if (this.dirty) {
      this.cleanupDeps();
      computedStack.push(this);
      try {
        this.cachedValue = this.getter();
      } finally {
        computedStack.pop();
      }
      this.dirty = false;
    }
    return this.cachedValue;
  }

  addDep = (depSet: Set<ComputedValue>): void => {
    this.deps.add(depSet);
    depSet.add(this);
  };

  notify = (): void => {
    if (!this.dirty) {
      this.dirty = true;
      this.observableManager.notify(this.fieldName);
    }
    this.dependents.forEach((dependent) => dependent.notify());
  };

  private cleanupDeps = (): void => {
    this.deps.forEach((depSet) => {
      depSet.delete(this);
    });
    this.deps.clear();
  };
}

class ObservableManager {
  private listenerKeysMap: Map<Listener, Set<string>> = new Map();

  subscribe = (listener: Listener, keys?: string[]): UnsubscribeFn => {
    if (!keys || keys.length === 0) {
      return () => {};
    }
    this.listenerKeysMap.set(listener, new Set(keys));
    return () => {
      this.listenerKeysMap.delete(listener);
    };
  };

  notify = (changedKey?: string): void => {
    if (!changedKey) {
      this.listenerKeysMap.forEach((subscribedKeys, listener) => {
        listener();
      });
      return;
    }

    this.listenerKeysMap.forEach((subscribedKeys, listener) => {
      if (subscribedKeys && subscribedKeys.has(changedKey)) {
        listener();
      }
    });
  };
}

// 用于缓存已代理的对象，避免重复代理
const proxyCache = new WeakMap<object, object>();
// 存储每个对象的依赖关系（用于 Proxy 层）
const propertyDepsMap = new WeakMap<object, Map<PropertyKey, Set<ComputedValue>>>();

export function makeAutoObservable<T>(target: T): T & ObservableValue {
  const manager = new ObservableManager();

  // 用于存储嵌套对象到其父级 key 的映射
  const parentKeyMap = new WeakMap<object, string>();

  /**
   * 使用 Proxy 代理嵌套对象（懒代理，性能优化）
   * 用于第二层及以下的对象/数组
   * @param obj 要代理的对象
   * @param parentKey 该对象在父对象中的 key 名称（用于通知订阅者）
   */
  const makeProxyReactive = <R extends object>(obj: R, parentKey?: string): R => {
    // 如果已经被代理过，更新 parentKey 并返回缓存
    if (proxyCache.has(obj)) {
      if (parentKey) {
        parentKeyMap.set(obj, parentKey);
      }
      return proxyCache.get(obj) as R;
    }

    // 保存父级 key
    if (parentKey) {
      parentKeyMap.set(obj, parentKey);
    }

    // 初始化依赖 Map
    if (!propertyDepsMap.has(obj)) {
      propertyDepsMap.set(obj, new Map());
    }
    const depsMap = propertyDepsMap.get(obj)!;

    const proxy = new Proxy(obj, {
      get(target: R, property: PropertyKey, receiver: unknown): unknown {
        // 跳过 symbol 和特殊属性
        if (typeof property === "symbol") {
          return Reflect.get(target, property, receiver);
        }

        const value = Reflect.get(target, property, receiver);

        // 如果是函数，绑定 this 为 proxy
        if (typeof value === "function") {
          return value.bind(receiver);
        }

        // 依赖收集
        const activeComputed = getCurrentComputed();
        if (activeComputed) {
          if (!depsMap.has(property)) {
            depsMap.set(property, new Set());
          }
          activeComputed.addDep(depsMap.get(property)!);
        }

        // 懒代理：如果值是对象，返回代理后的对象
        // 传递 parentKey 到所有嵌套层级，这样深层修改也能通知到顶层
        if (value !== null && typeof value === "object") {
          const topLevelKey = parentKeyMap.get(obj);
          return makeProxyReactive(value, topLevelKey || parentKey);
        }

        return value;
      },

      set(target: R, property: PropertyKey, newValue: unknown, receiver: unknown): boolean {
        // 跳过 symbol
        if (typeof property === "symbol") {
          return Reflect.set(target, property, newValue, receiver);
        }

        const oldValue = Reflect.get(target, property, receiver);

        // 只有值真正改变时才触发更新
        if (oldValue === newValue) {
          return true;
        }

        // 设置新值
        const result = Reflect.set(target, property, newValue, receiver);

        if (result) {
          // 通知依赖的 computed
          const deps = depsMap.get(property);
          if (deps) {
            deps.forEach((computed) => computed.notify());
          }

          // 【关键修复】：如果有父级 key，通知父级 key（让订阅者知道顶层属性变化了）
          const topLevelKey = parentKeyMap.get(obj);
          if (topLevelKey) {
            manager.notify(topLevelKey);
          }
        }

        return result;
      },
    });

    // 缓存代理关系
    proxyCache.set(obj, proxy);

    return proxy;
  };

  /**
   * 使用 Object.defineProperty 代理顶层对象
   * 保证箭头函数的 this 指向正确
   */
  const makeReactive = <R extends object>(obj: R): R => {
    const keys = Object.keys(obj) as Array<keyof R>;
    const proto = Object.getPrototypeOf(obj);
    const protoKeys = proto ? Object.getOwnPropertyNames(proto) : [];

    const processKey = (key: string | keyof R): void => {
      if (key === "constructor") {
        return;
      }
      let descriptor = Object.getOwnPropertyDescriptor(obj, key);
      if (!descriptor) {
        descriptor = Object.getOwnPropertyDescriptor(proto, key);
      }
      if (!descriptor || !descriptor.configurable) {
        return;
      }

      // 处理 computed 属性（getter）
      const isGetter = descriptor.get !== undefined;
      if (isGetter) {
        const originalGetter = descriptor.get;
        const computed = new ComputedValue({
          fieldName: String(key),
          getter: originalGetter.bind(obj),
          observableManager: manager,
        });

        Object.defineProperty(obj, key, {
          enumerable: descriptor.enumerable,
          configurable: true,
          get(): unknown {
            return computed.value;
          },
          set(newValue: unknown): void {
            console.warn(
              `[Store] 警告: 尝试给 computed 属性 "${String(key)}" 赋值。Computed 属性是只读的，该操作将被忽略。`,
            );
          },
        });
        return;
      }

      // 跳过函数（包括箭头函数）
      const value = obj[key as keyof R];
      if (typeof value === "function") {
        return;
      }

      // 处理普通属性
      const computedDeps: Set<ComputedValue> = new Set();
      // 【关键改动】：嵌套对象使用 Proxy 代理而不是递归 Object.defineProperty
      // 传入 key 作为 parentKey，这样嵌套对象修改时能通知到顶层 key
      let internalValue: unknown =
        value !== null && typeof value === "object"
          ? makeProxyReactive(value as object, String(key))
          : value;

      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get(): unknown {
          const activeComputed = getCurrentComputed();
          if (activeComputed) {
            activeComputed.addDep(computedDeps);
          }
          return internalValue;
        },
        set(newValue: unknown): void {
          if (internalValue !== newValue) {
            // 【关键改动】：新值如果是对象，使用 Proxy 代理
            // 传入 key 作为 parentKey
            internalValue =
              newValue !== null && typeof newValue === "object"
                ? makeProxyReactive(newValue as object, String(key))
                : newValue;
            computedDeps.forEach((computed) => computed.notify());
            manager.notify(String(key));
          }
        },
      });
    };

    keys.forEach(processKey);
    protoKeys.forEach(processKey);

    return obj;
  };

  // 顶层对象使用 Object.defineProperty
  const result = makeReactive(target as object);

  // 添加 subscribe 方法
  Object.defineProperty(result, "subscribe", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: manager.subscribe,
  });

  return result as T & ObservableValue;
}
