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
    new Set(this.dependents).forEach((dependent) => dependent.notify());
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

const proxyCache = new WeakMap<object, object>();
const propertyDepsMap = new WeakMap<object, Map<PropertyKey, Set<ComputedValue>>>();

export function makeAutoObservable<T>(target: T): T & ObservableValue {
  const manager = new ObservableManager();

  const parentKeyMap = new WeakMap<object, string>();

  const makeProxyReactive = <R extends object>(obj: R, parentKey?: string): R => {
    if (proxyCache.has(obj)) {
      if (parentKey) {
        parentKeyMap.set(obj, parentKey);
      }
      return proxyCache.get(obj) as R;
    }

    if (parentKey) {
      parentKeyMap.set(obj, parentKey);
    }

    if (!propertyDepsMap.has(obj)) {
      propertyDepsMap.set(obj, new Map());
    }
    const depsMap = propertyDepsMap.get(obj)!;

    const proxy = new Proxy(obj, {
      get(target: R, property: PropertyKey, receiver: unknown): unknown {
        if (typeof property === "symbol") {
          return Reflect.get(target, property, receiver);
        }

        const value = Reflect.get(target, property, receiver);

        if (typeof value === "function") {
          return value.bind(receiver);
        }

        const activeComputed = getCurrentComputed();
        if (activeComputed) {
          if (!depsMap.has(property)) {
            depsMap.set(property, new Set());
          }
          activeComputed.addDep(depsMap.get(property)!);
        }

        if (value !== null && typeof value === "object") {
          const topLevelKey = parentKeyMap.get(obj);
          return makeProxyReactive(value, topLevelKey || parentKey);
        }

        return value;
      },

      set(target: R, property: PropertyKey, newValue: unknown, receiver: unknown): boolean {
        if (typeof property === "symbol") {
          return Reflect.set(target, property, newValue, receiver);
        }
        const oldValue = Reflect.get(target, property, receiver);
        if (oldValue === newValue) {
          return true;
        }
        const result = Reflect.set(target, property, newValue, receiver);
        if (result) {
          const deps = depsMap.get(property);
          if (deps) {
            new Set(deps).forEach((computed) => computed.notify());
          }

          const topLevelKey = parentKeyMap.get(obj);
          if (topLevelKey) {
            manager.notify(topLevelKey);
          }
        }

        return result;
      },
    });

    proxyCache.set(obj, proxy);

    return proxy;
  };

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

      const value = obj[key as keyof R];
      if (typeof value === "function") {
        return;
      }

      const computedDeps: Set<ComputedValue> = new Set();
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
            internalValue =
              newValue !== null && typeof newValue === "object"
                ? makeProxyReactive(newValue as object, String(key))
                : newValue;
            new Set(computedDeps).forEach((computed) => computed.notify());
            manager.notify(String(key));
          }
        },
      });
    };

    keys.forEach(processKey);
    protoKeys.forEach(processKey);

    return obj;
  };

  const result = makeReactive(target as object);

  Object.defineProperty(result, "subscribe", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: manager.subscribe,
  });

  return result as T & ObservableValue;
}
