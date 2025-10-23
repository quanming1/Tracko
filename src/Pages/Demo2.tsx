import React from "react";
import { useStores } from "../stores";

export const Demo2: React.FC = () => {
  const { counterStore, userStore } = useStores();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Demo2: Computed 嵌套测试</h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        测试 computed 属性的嵌套依赖以及 computed 访问其他 computed
      </p>

      <div style={{ marginBottom: "30px" }}>
        <h3>1. Computed 访问 Computed</h3>
        <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
          <p>
            <strong>count:</strong> {counterStore.count}
          </p>
          <p style={{ color: "#1890ff" }}>
            <strong>double (computed):</strong> {counterStore.double}
          </p>
          <p style={{ color: "#52c41a" }}>
            <strong>quadruple (computed, 依赖 double):</strong> {counterStore.quadruple}
          </p>
          <p style={{ fontSize: "12px", color: "#999", marginTop: "10px" }}>
            quadruple 通过访问 double 来计算，形成 computed 的嵌套依赖链：
            <br />
            count → double → quadruple
          </p>
        </div>
        <div style={{ marginTop: "10px" }}>
          <button onClick={() => (counterStore.count += 1)} style={btnStyle}>
            count + 1
          </button>
          <button onClick={() => (counterStore.count -= 1)} style={btnStyle}>
            count - 1
          </button>
          <button onClick={() => (counterStore.count = 0)} style={btnStyle}>
            重置 count
          </button>
        </div>
      </div>

      <hr />

      <div style={{ marginBottom: "30px" }}>
        <h3>2. 复杂 Computed 嵌套</h3>
        <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
          <p>
            <strong>UserStore.name:</strong> {userStore.name}
          </p>
          <p>
            <strong>UserStore.age:</strong> {userStore.age}
          </p>
          <p style={{ color: "#1890ff" }}>
            <strong>displayName (computed):</strong> {userStore.displayName}
          </p>
          <p style={{ color: "#52c41a" }}>
            <strong>fullInfo (computed):</strong>
          </p>
          <pre
            style={{
              color: "#52c41a",
              fontSize: "12px",
              background: "white",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {JSON.stringify(userStore.fullInfo, null, 2)}
          </pre>
          <p style={{ fontSize: "12px", color: "#999", marginTop: "10px" }}>
            fullInfo 内部访问了多个属性（name, age, email, city），
            <br />
            任何一个属性变化都会触发 fullInfo 重新计算
          </p>
        </div>
        <div style={{ marginTop: "10px" }}>
          <button onClick={() => (userStore.name = "王五")} style={btnStyle}>
            name = 王五
          </button>
          <button onClick={() => (userStore.age = 25)} style={btnStyle}>
            age = 25
          </button>
          <button onClick={() => (userStore.email = "wangwu@example.com")} style={btnStyle}>
            设置邮箱
          </button>
          <button onClick={() => (userStore.city = "深圳")} style={btnStyle}>
            city = 深圳
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
