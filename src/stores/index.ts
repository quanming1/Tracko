import { CounterStore } from "./counterStore";
import { UserStore } from "./userStore";
import { createStores } from "../lib";

const { stores, useStores } = createStores({
  counterStore: CounterStore,
  userStore: UserStore,
});

export { stores, useStores };
export const { counterStore, userStore } = stores;
