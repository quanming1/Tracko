import { CounterStore } from "./counterStore";
import { UserStore } from "./userStore";

export const counterStore = new CounterStore();
export const userStore = new UserStore();

export type { CounterStore } from "./counterStore";
export type { UserStore } from "./userStore";

export const stores = {
  counterStore,
  userStore,
} as const;
export type TStores = typeof stores;
