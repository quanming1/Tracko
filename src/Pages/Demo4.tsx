import React, { useRef } from "react";
import { useStores } from "../stores";

// 组件 A: 只读取 counterStore.count
const OnlyCounterComponent: React.FC = () => {
  const { counterStore } = useStores();
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log("🔴 OnlyCounterComponent 渲染了！", renderCount.current);

  return (
    <div
      style={{
        border: "3px solid #ff4d4f",
        padding: "20px",
        borderRadius: "8px",
        margin: "10px 0",
        background: "#fff1f0",
      }}
    >
      <h4 style={{ color: "#ff4d4f", marginTop: 0 }}>🔴 组件 A - 只访问 counterStore</h4>
      <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
        <p>
          <strong>读取的数据:</strong> counterStore.count = {counterStore.count}
        </p>
        <p style={{ color: "#ff4d4f", fontWeight: "bold" }}>
          <strong>组件渲染次数:</strong> {renderCount.current} 次
        </p>
      </div>
      <button onClick={() => (counterStore.count += 1)} style={btnStyle}>
        修改 count + 1
      </button>
    </div>
  );
};

// 组件 B: 只读取 userStore.name
const OnlyUserComponent: React.FC = () => {
  const { userStore } = useStores();
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log("🔵 OnlyUserComponent 渲染了！", renderCount.current);

  return (
    <div
      style={{
        border: "3px solid #1890ff",
        padding: "20px",
        borderRadius: "8px",
        margin: "10px 0",
        background: "#e6f7ff",
      }}
    >
      <h4 style={{ color: "#1890ff", marginTop: 0 }}>🔵 组件 B - 只访问 userStore</h4>
      <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
        <p>
          <strong>读取的数据:</strong> userStore.name = {userStore.name}
        </p>
        <p style={{ color: "#1890ff", fontWeight: "bold" }}>
          <strong>组件渲染次数:</strong> {renderCount.current} 次
        </p>
      </div>
      <button onClick={() => (userStore.name = "用户_" + Date.now())} style={btnStyle}>
        修改 name
      </button>
    </div>
  );
};

// 组件 C: 只读取 userStore.age
const OnlyUserAgeComponent: React.FC = () => {
  const { userStore } = useStores();
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log("🟢 OnlyUserAgeComponent 渲染了！", renderCount.current);

  return (
    <div
      style={{
        border: "3px solid #52c41a",
        padding: "20px",
        borderRadius: "8px",
        margin: "10px 0",
        background: "#f6ffed",
      }}
    >
      <h4 style={{ color: "#52c41a", marginTop: 0 }}>🟢 组件 C - 只访问 userStore.age</h4>
      <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
        <p>
          <strong>读取的数据:</strong> userStore.age = {userStore.age}
        </p>
        <p style={{ color: "#52c41a", fontWeight: "bold" }}>
          <strong>组件渲染次数:</strong> {renderCount.current} 次
        </p>
      </div>
      <button onClick={() => (userStore.age += 1)} style={btnStyle}>
        修改 age + 1
      </button>
    </div>
  );
};

export const Demo4: React.FC = () => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Demo4: 重渲染问题测试 🐛</h2>
      <p style={{ color: "#666", marginBottom: "10px" }}>
        测试组件的按需更新机制 - 当前实现存在性能问题
      </p>
      <p style={{ fontSize: "14px", color: "#ff4d4f", fontWeight: "bold", marginBottom: "30px" }}>
        父组件渲染次数: {renderCount.current} 次
      </p>

      <div
        style={{
          background: "#fffbe6",
          border: "2px solid #faad14",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ color: "#faad14", marginTop: 0 }}>⚠️ 测试说明</h3>
        <div style={{ fontSize: "14px", lineHeight: "2" }}>
          <p>
            <strong>理想行为（按需更新）：</strong>
          </p>
          <ul style={{ marginLeft: "20px" }}>
            <li>点击 "修改 count + 1" 按钮 → 只有 🔴 组件 A 应该重渲染</li>
            <li>点击 "修改 name" 按钮 → 只有 🔵 组件 B 应该重渲染</li>
            <li>点击 "修改 age + 1" 按钮 → 只有 🟢 组件 C 应该重渲染</li>
          </ul>
          <p style={{ marginTop: "15px" }}>
            <strong style={{ color: "#ff4d4f" }}>实际行为（当前问题）：</strong>
          </p>
          <ul style={{ marginLeft: "20px" }}>
            <li style={{ color: "#ff4d4f" }}>
              修改任何 store 的任何属性 → 所有使用 useStores 的组件都会重渲染 ❌
            </li>
            <li style={{ color: "#ff4d4f" }}>
              原因：useEffect 订阅了所有 store 的变化，没有实现按需订阅
            </li>
          </ul>
          <p style={{ marginTop: "15px", fontSize: "13px", color: "#666" }}>
            💡 <strong>如何观察：</strong>打开浏览器控制台（F12），观察每次点击按钮后：
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;1. 控制台输出的日志（哪些组件渲染了）
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;2. 每个组件内的"组件渲染次数"计数器
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <OnlyCounterComponent />
        <OnlyUserComponent />
        <OnlyUserAgeComponent />
      </div>

      <div
        style={{
          background: "#f0f0f0",
          padding: "15px",
          borderRadius: "8px",
          marginTop: "30px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>🔍 测试步骤</h3>
        <ol style={{ fontSize: "14px", lineHeight: "2", marginLeft: "20px" }}>
          <li>
            <strong>刷新页面</strong>，注意三个组件的初始渲染次数都是 1
          </li>
          <li>
            <strong>点击 🔴 组件 A 的按钮</strong>（修改 count）
            <br />
            <span style={{ color: "#52c41a" }}>✓ 预期：只有组件 A 的计数器增加</span>
            <br />
            <span style={{ color: "#ff4d4f" }}>✗ 实际：所有三个组件的计数器都增加了</span>
          </li>
          <li>
            <strong>刷新页面</strong>，再点击 🔵 组件 B 的按钮（修改 name）
            <br />
            <span style={{ color: "#52c41a" }}>✓ 预期：只有组件 B 的计数器增加</span>
            <br />
            <span style={{ color: "#ff4d4f" }}>✗ 实际：所有三个组件的计数器都增加了</span>
          </li>
          <li>
            <strong>刷新页面</strong>，再点击 🟢 组件 C 的按钮（修改 age）
            <br />
            <span style={{ color: "#52c41a" }}>✓ 预期：只有组件 C 的计数器增加</span>
            <br />
            <span style={{ color: "#ff4d4f" }}>✗ 实际：所有三个组件的计数器都增加了</span>
          </li>
        </ol>
      </div>

      <div
        style={{
          background: "#e6f7ff",
          border: "2px solid #1890ff",
          padding: "15px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h3 style={{ color: "#1890ff", marginTop: 0 }}>💡 问题根源</h3>
        <p style={{ fontSize: "14px", lineHeight: "1.8" }}>
          在 <code>createUseStores.ts</code> 的第 48-52 行：
        </p>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
            fontSize: "13px",
            overflow: "auto",
          }}
        >
          {`const unsubscribers = Object.keys(stores).map((storeName) => {
  return stores[storeName].subscribe(() => {
    forceUpdate(); // ❌ 任何 store 变化都触发更新
  });
});`}
        </pre>
        <p style={{ fontSize: "14px", lineHeight: "1.8", marginTop: "15px" }}>
          虽然代码追踪了 <code>accessedKeysRef</code>（第 11、19
          行），但并没有利用这个信息来实现按需订阅。
          <br />
          当前订阅了所有 store 的所有变化，导致任何 store 的任何属性改变都会触发所有组件重渲染。
        </p>
      </div>

      <div
        style={{
          background: "#f6ffed",
          border: "2px solid #52c41a",
          padding: "15px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h3 style={{ color: "#52c41a", marginTop: 0 }}>✅ 解决方案</h3>
        <p style={{ fontSize: "14px", lineHeight: "1.8" }}>需要实现细粒度的订阅机制：</p>
        <ol style={{ fontSize: "14px", lineHeight: "2", marginLeft: "20px" }}>
          <li>
            <strong>方案 1:</strong> 在 store 层面实现属性级别的订阅（推荐）
            <br />
            每个属性维护自己的订阅者列表，只在该属性变化时通知
          </li>
          <li>
            <strong>方案 2:</strong> 在 useStores 中实现智能订阅
            <br />
            根据 accessedKeysRef 只订阅被访问的属性
          </li>
          <li>
            <strong>方案 3:</strong> 使用订阅过滤器
            <br />
            在通知时检查变化的属性是否被当前组件访问
          </li>
        </ol>
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
  fontSize: "14px",
};
