import { CounterStore } from "./counterStore";
import { UserStore } from "./userStore";
import { makeAutoObservable, createUseStores } from "../lib";

export const counterStore = makeAutoObservable(new CounterStore());
export const userStore = makeAutoObservable(new UserStore());

export const stores = {
  counterStore,
  userStore,
} as const;

export const useStores = createUseStores(stores);
