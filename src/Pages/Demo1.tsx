import React from "react";
import { useStores } from "../stores";

export const Demo1: React.FC = () => {
  const { userStore, counterStore } = useStores();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Demo1: 简单响应式测试</h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        测试基础属性的响应式更新和简单的 computed 属性
      </p>

      <div style={{ marginBottom: "30px" }}>
        <h3>CounterStore</h3>
        <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
          <p>
            <strong>count:</strong> {counterStore.count}
          </p>
          <p>
            <strong>history:</strong> {JSON.stringify(counterStore.history)}
          </p>
          <p style={{ color: "#1890ff" }}>
            <strong>double (computed):</strong> {counterStore.double}
          </p>
          <p style={{ color: "#1890ff" }}>
            <strong>historyLength (computed):</strong> {counterStore.historyLength}
          </p>
        </div>
        <div style={{ marginTop: "10px" }}>
          <button onClick={() => (counterStore.count += 1)} style={btnStyle}>
            count + 1
          </button>
          <button onClick={() => (counterStore.count -= 1)} style={btnStyle}>
            count - 1
          </button>
          <button
            onClick={() => {
              counterStore.history.push(counterStore.count);
              counterStore.history = [...counterStore.history];
            }}
            style={btnStyle}
          >
            添加到 history
          </button>
          <button
            onClick={() => {
              counterStore.count = 0;
              counterStore.history = [];
            }}
            style={btnStyle}
          >
            重置
          </button>
        </div>
      </div>

      <hr />

      <div style={{ marginBottom: "30px" }}>
        <h3>UserStore</h3>
        <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
          <p>
            <strong>name:</strong> {userStore.name}
          </p>
          <p>
            <strong>age:</strong> {userStore.age}
          </p>
          <p>
            <strong>email:</strong> {userStore.email || "未设置"}
          </p>
          <p>
            <strong>city:</strong> {userStore.city || "未设置"}
          </p>
          <p style={{ color: "#1890ff" }}>
            <strong>displayName (computed):</strong> {userStore.displayName}
          </p>
          <p style={{ color: "#1890ff" }}>
            <strong>fullInfo (computed):</strong>
          </p>
          <pre
            style={{
              color: "#1890ff",
              fontSize: "12px",
              background: "white",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {JSON.stringify(userStore.fullInfo, null, 2)}
          </pre>
        </div>
        <div style={{ marginTop: "10px" }}>
          <button onClick={() => (userStore.name = "张三")} style={btnStyle}>
            name = 张三
          </button>
          <button onClick={() => (userStore.name = "李四")} style={btnStyle}>
            name = 李四
          </button>
          <button onClick={() => (userStore.age += 1)} style={btnStyle}>
            age + 1
          </button>
          <button onClick={() => (userStore.age -= 1)} style={btnStyle}>
            age - 1
          </button>
          <button onClick={() => (userStore.email = "test@example.com")} style={btnStyle}>
            设置邮箱
          </button>
          <button onClick={() => (userStore.city = "北京")} style={btnStyle}>
            city = 北京
          </button>
          <button onClick={() => (userStore.city = "上海")} style={btnStyle}>
            city = 上海
          </button>
        </div>
      </div>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  margin: "5px",
  padding: "8px 16px",
  background: "#1890ff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
