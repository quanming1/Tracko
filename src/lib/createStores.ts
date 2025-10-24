import { makeAutoObservable, ObservableValue } from "./makeAutoObservable";
import { createUseStores } from "./createUseStores";

type StoreClass<T = any> = new (...args: any[]) => T;

export function createStores<T extends Record<string, StoreClass>>(
  storeClasses: T,
): {
  stores: { [K in keyof T]: InstanceType<T[K]> & ObservableValue };
  useStores: () => { [K in keyof T]: InstanceType<T[K]> & ObservableValue };
} {
  const stores = {} as { [K in keyof T]: InstanceType<T[K]> & ObservableValue };

  for (const key in storeClasses) {
    const StoreClass = storeClasses[key];
    stores[key] = makeAutoObservable(new StoreClass());
  }

  const useStores = createUseStores(stores);

  return { stores, useStores };
}
