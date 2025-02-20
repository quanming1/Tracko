import React from "react";
import { useStore } from "../../stores/center";
import styles from "./index.module.scss";

// 使用 useStore 的组件会响应所有 store 的变化
const StoreDisplay: React.FC = () => {
  // 直接解构获取需要的 store
  const { counterStore, userStore } = useStore();

  return (
    <div className={styles["store-card"]}>
      <h3>Store 监听</h3>
      <div>
        <h4>Counter Store:</h4>
        <p>计数: {counterStore.count}</p>
        <p>操作次数: {counterStore.operationCount}</p>
        <div className={styles["button-group"]}>
          <button onClick={counterStore.increment}>增加</button>
          <button onClick={counterStore.decrement}>减少</button>
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h4>User Store:</h4>
        <p>姓名: {userStore.name}</p>
        <p>年龄: {userStore.age}</p>
        <p>主题: {userStore.preferences.theme}</p>
        <div className={styles["button-group"]}>
          <button onClick={() => userStore.setName("用户" + Math.floor(Math.random() * 100))}>
            随机名字
          </button>
          <button onClick={() => userStore.setAge(Math.floor(Math.random() * 50 + 18))}>
            随机年龄
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
    </div>
  );
};

// 主组件
const StoreUpdateDemo: React.FC = () => {
  return (
    <div className={styles["test-page"]}>
      <div className={styles["outter"]}>
        <h1>Store 更新监听演示</h1>
        <div className={styles["cards-container"]}>
          <StoreDisplay />
        </div>
      </div>
    </div>
  );
};

export default StoreUpdateDemo;
