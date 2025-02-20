import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/center";

export const Counter: React.FC = observer(() => {
  const { counterStore } = useStore();

  return (
    <div>
      <h1>计数器: {counterStore.count}</h1>
      <button onClick={counterStore.increment}>增加</button>
      <button onClick={counterStore.decrement}>减少</button>
    </div>
  );
});
