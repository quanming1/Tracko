import React from "react";
import { useStores } from "../stores";

const NestedLevel1: React.FC = () => {
  const { counterStore } = useStores();

  return (
    <div
      style={{
        border: "2px solid #52c41a",
        padding: "15px",
        borderRadius: "8px",
        margin: "10px 0",
        background: "#f6ffed",
      }}
    >
      <h4 style={{ color: "#52c41a", margin: "0 0 10px 0" }}>Level 1 组件</h4>
      <p>读取: count = {counterStore.count}</p>
      <p>读取: double = {counterStore.double}</p>
      <button
        onClick={() => (counterStore.count += 1)}
        style={{ ...btnStyle, background: "#52c41a" }}
      >
        count + 1
      </button>
    </div>
  );
};

const NestedLevel2: React.FC = () => {
  const { counterStore } = useStores();

  return (
    <div
      style={{
        border: "2px solid #fa8c16",
        padding: "15px",
        borderRadius: "8px",
        margin: "10px 0 10px 30px",
        background: "#fff7e6",
      }}
    >
      <h4 style={{ color: "#fa8c16", margin: "0 0 10px 0" }}>Level 2 组件</h4>
      <p>读取: quadruple = {counterStore.quadruple}</p>
      <button
        onClick={() => {
          counterStore.count += 1;
        }}
        style={{ ...btnStyle, background: "#fa8c16" }}
      >
        count + 1
      </button>
    </div>
  );
};

const NestedLevel3: React.FC = () => {
  const { counterStore } = useStores();

  return (
    <div
      style={{
        border: "2px solid #722ed1",
        padding: "15px",
        borderRadius: "8px",
        margin: "10px 0 10px 60px",
        background: "#f9f0ff",
      }}
    >
      <h4 style={{ color: "#722ed1", margin: "0 0 10px 0" }}>Level 3 组件（三层嵌套）</h4>
      <p>读取: octuple = {counterStore.octuple}</p>
      <p style={{ fontSize: "12px", color: "#666" }}>
        octuple 依赖 quadruple 依赖 double 依赖 count
      </p>
      <button
        onClick={() => {
          counterStore.count += 1;
        }}
        style={{ ...btnStyle, background: "#722ed1" }}
      >
        count + 1
      </button>
    </div>
  );
};

export const Demo3: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Demo3: 组件嵌套响应式测试</h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        测试多层嵌套组件的响应式更新以及跨 Store 访问
      </p>

      <div style={{ marginBottom: "30px" }}>
        <h3>多层嵌套 Computed 测试</h3>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>
          测试三层 computed 嵌套：count → double → quadruple → octuple
          <br />
          打开控制台可以看到依赖链的计算过程
        </p>

        <NestedLevel1 />
        <NestedLevel2 />
        <NestedLevel3 />

        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            background: "#fafafa",
            borderRadius: "4px",
          }}
        >
          <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
            💡 提示：打开浏览器控制台，观察组件渲染日志
          </p>
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
