import React from "react";
import { useStore } from "../../stores/center";
import styles from "./index.module.scss";

// 不使用 observer 的组件
const Counter: React.FC = () => {
  const { counterStore } = useStore();

  return (
    <div className={styles["counter-content"]}>
      <h2>计数器组件</h2>
      <p>计数: {counterStore.count}</p>
      <p>操作次数: {counterStore.operationCount}</p>
    </div>
  );
};

const TestPage: React.FC = () => {
  const { counterStore } = useStore();

  return (
    <div className={styles["test-page"]}>
      <div className={styles["outter"]}>
        <h1>MobX Store 监听演示</h1>
        <Counter />
        <div className={styles["button-group"]}>
          <button onClick={counterStore.increment}>增加</button>
          <button onClick={counterStore.decrement}>减少</button>
          <button onClick={counterStore.reset}>重置</button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
