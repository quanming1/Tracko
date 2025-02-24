import React, { useCallback } from "react";
import { useStore } from "../../stores/center";
import styles from "./index.module.scss";

// 只监听 counter 相关数据的组件
const CounterDisplay: React.FC = () => {
  const counterSelector = useCallback(
    (stores) => ({
      count: stores.counterStore.count,
      operationCount: stores.counterStore.operationCount,
    }),
    [],
  );

  const { count, operationCount } = useStore(counterSelector);

  console.log("CounterDisplay 重新渲染");

  return (
    <div className={styles["store-card"]}>
      <h3>Counter 监听 (仅监听 counter 数据)</h3>
      <div>
        <p>计数: {count}</p>
        <p>操作次数: {operationCount}</p>
      </div>
    </div>
  );
};

// 只监听用户基础信息的组件
const UserBasicDisplay: React.FC = () => {
  const userBasicSelector = useCallback(
    (stores) => ({
      name: stores.userStore.name,
      age: stores.userStore.age,
    }),
    [],
  );

  const { name, age } = useStore(userBasicSelector);

  console.log("UserBasicDisplay 重新渲染");

  return (
    <div className={styles["store-card"]}>
      <h3>用户基础信息 (仅监听 name 和 age)</h3>
      <div className={styles["section"]}>
        <p>姓名: {name}</p>
        <p>年龄: {age}</p>
      </div>
    </div>
  );
};

// 只监听用户偏好设置的组件
const UserPreferencesDisplay: React.FC = () => {
  const preferencesSelector = useCallback((stores) => stores.userStore.preferences, []);

  const preferences = useStore(preferencesSelector);

  console.log("UserPreferencesDisplay 重新渲染");

  return (
    <div className={styles["store-card"]}>
      <h3>用户偏好设置 (仅监听 preferences)</h3>
      <div className={styles["section"]}>
        <p>主题: {preferences.theme}</p>
        <p>语言: {preferences.language}</p>
        <p>字体大小: {preferences.display.fontSize}</p>
        <p>主题色: {preferences.display.colorMode.primary}</p>
      </div>
    </div>
  );
};

// 控制面板组件
const ControlPanel: React.FC = () => {
  // 控制面板需要完整的 store 访问权限，所以不需要选择器
  const { counterStore, userStore } = useStore();

  return (
    <div className={styles["store-card"]}>
      <h3>控制面板</h3>
      <div className={styles["button-group"]}>
        <button onClick={counterStore.increment}>增加计数</button>
        <button onClick={counterStore.decrement}>减少计数</button>
        <button onClick={() => userStore.setName("用户" + Math.floor(Math.random() * 100))}>
          修改用户名
        </button>
        <button onClick={() => userStore.setAge(Math.floor(Math.random() * 50 + 18))}>
          修改年龄
        </button>
        <button
          onClick={() =>
            userStore.setTheme(userStore.preferences.theme === "light" ? "dark" : "light")
          }
        >
          切换主题
        </button>
      </div>
    </div>
  );
};

// 主组件
const StoreUpdateDemo: React.FC = () => {
  return (
    <div className={styles["test-page"]}>
      <div className={styles["outter"]}>
        <h1>Store 选择性监听演示</h1>
        <p className={styles["description"]}>
          每个组件只监听自己需要的数据，查看控制台可以看到不同操作只会触发相关组件的重新渲染
        </p>
        <div className={styles["cards-container"]}>
          <ControlPanel />
          <CounterDisplay />
          <UserBasicDisplay />
          <UserPreferencesDisplay />
        </div>
      </div>
    </div>
  );
};

export default StoreUpdateDemo;
