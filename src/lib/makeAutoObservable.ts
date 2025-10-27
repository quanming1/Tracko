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

export function makeAutoObservable<T>(target: T): T & ObservableValue {
  const manager = new ObservableManager();

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
        value !== null && typeof value === "object" ? makeReactive(value as object) : value;

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
                ? makeReactive(newValue as object)
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

  const result = makeReactive(target as object);

  Object.defineProperty(result, "subscribe", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: manager.subscribe,
  });

  return result as T & ObservableValue;
}
