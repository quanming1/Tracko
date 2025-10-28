import { CounterStore } from "./counterStore";
import { UserStore } from "./userStore";
import { createStores } from "../lib";

const { stores, useStores } = createStores({
  counterStore: CounterStore,
  userStore: UserStore,
});

stores.counterStore.subscribe(() => {
  console.log("counterStore.octuple 变化", stores.counterStore.octuple);
}, ["octuple"]);

export { stores, useStores };
export const { counterStore, userStore } = stores;
