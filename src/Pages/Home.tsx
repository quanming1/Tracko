import React, { useState, useEffect } from "react";
import { Demo1 } from "./Demo1";
import { Demo2 } from "./Demo2";
import { Demo3 } from "./Demo3";
import { Demo4 } from "./Demo4";
import { Demo5 } from "./Demo5";

type DemoType = "demo1" | "demo2" | "demo3" | "demo4" | "demo5";

const Home: React.FC = () => {
  const getInitialDemo = (): DemoType => {
    const params = new URLSearchParams(window.location.search);
    const demo = params.get("demo") as DemoType;
    return demo && ["demo1", "demo2", "demo3", "demo4", "demo5"].includes(demo) ? demo : "demo1";
  };

  const [currentDemo, setCurrentDemo] = useState<DemoType>(getInitialDemo);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("demo", currentDemo);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  }, [currentDemo]);

  const renderDemo = () => {
    switch (currentDemo) {
      case "demo1":
        return <Demo1 />;
      case "demo2":
        return <Demo2 />;
      case "demo3":
        return <Demo3 />;
      case "demo4":
        return <Demo4 />;
      case "demo5":
        return <Demo5 />;
      default:
        return <Demo1 />;
    }
  };

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh" }}>
      <nav style={navStyle}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>响应式系统测试</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setCurrentDemo("demo1")}
            style={{
              ...navButtonStyle,
              ...(currentDemo === "demo1" ? activeNavButtonStyle : {}),
            }}
          >
            Demo1: 简单响应式
          </button>
          <button
            onClick={() => setCurrentDemo("demo2")}
            style={{
              ...navButtonStyle,
              ...(currentDemo === "demo2" ? activeNavButtonStyle : {}),
            }}
          >
            Demo2: Computed 嵌套
          </button>
          <button
            onClick={() => setCurrentDemo("demo3")}
            style={{
              ...navButtonStyle,
              ...(currentDemo === "demo3" ? activeNavButtonStyle : {}),
            }}
          >
            Demo3: 组件嵌套
          </button>
          <button
            onClick={() => setCurrentDemo("demo4")}
            style={{
              ...navButtonStyle,
              ...(currentDemo === "demo4" ? activeNavButtonStyle : {}),
            }}
          >
            Demo4: 重渲染问题 🐛
          </button>
          <button
            onClick={() => setCurrentDemo("demo5")}
            style={{
              ...navButtonStyle,
              ...(currentDemo === "demo5" ? activeNavButtonStyle : {}),
            }}
          >
            Demo5: 死循环测试 ⚠️
          </button>
        </div>
      </nav>

      <main style={{ padding: "0" }}>{renderDemo()}</main>
    </div>
  );
};

const navStyle: React.CSSProperties = {
  background: "#001529",
  color: "white",
  padding: "16px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const navButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  background: "transparent",
  color: "white",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  transition: "all 0.3s",
};

const activeNavButtonStyle: React.CSSProperties = {
  background: "#1890ff",
  borderColor: "#1890ff",
};

export default Home;
