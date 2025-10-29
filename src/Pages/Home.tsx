import React, { useState, useEffect } from "react";
import { Demo1 } from "./Demo1";
import { Demo3 } from "./Demo3";
import { Demo4 } from "./Demo4";
import { DemoReliabilityMemory } from "./MemoryTest/Demo-Reliability-Memory";
import { ReliabilityMemoryMobX } from "./MemoryTest/Reliability-Memory-MobX";
import { ReliabilityMemoryMyStore } from "./MemoryTest/Reliability-Memory-MyStore";

type DemoType = "demo1" | "demo3" | "demo4" | "reliability-memory";

const Home: React.FC = () => {
  const getInitialDemo = (): DemoType => {
    const params = new URLSearchParams(window.location.search);
    const testType = params.get("test");

    // 特殊的测试窗口
    if (testType === "mobx-memory" || testType === "mystore-memory") {
      return testType as any;
    }

    const demo = params.get("demo") as DemoType;
    return demo && ["demo1", "demo3", "demo4", "reliability-memory"].includes(demo)
      ? demo
      : "demo1";
  };

  const [currentDemo, setCurrentDemo] = useState<DemoType>(getInitialDemo);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const testType = params.get("test");

    // 如果是特殊的测试窗口，不修改URL
    if (testType === "mobx-memory" || testType === "mystore-memory") {
      return;
    }

    params.set("demo", currentDemo);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  }, [currentDemo]);

  const renderDemo = () => {
    const params = new URLSearchParams(window.location.search);
    const testType = params.get("test");

    if (testType === "mobx-memory") {
      return <ReliabilityMemoryMobX />;
    }
    if (testType === "mystore-memory") {
      return <ReliabilityMemoryMyStore />;
    }

    switch (currentDemo) {
      case "demo1":
        return <Demo1 />;
      case "demo3":
        return <Demo3 />;
      case "demo4":
        return <Demo4 />;
      case "reliability-memory":
        return <DemoReliabilityMemory />;
      default:
        return <Demo1 />;
    }
  };

  const categories = [
    {
      name: "可行性测试",
      demos: [
        { id: "demo1", name: "基础操作" },
        { id: "demo3", name: "Getter组件嵌套" },
        { id: "demo4", name: "渲染颗粒度测试" },
      ],
    },
    {
      name: "可靠性测试",
      demos: [{ id: "reliability-memory", name: "内存占用对比" }],
    },
  ];

  // 处理特殊的测试窗口，不显示侧边栏
  const params = new URLSearchParams(window.location.search);
  const testType = params.get("test");
  if (testType === "mobx-memory" || testType === "mystore-memory") {
    return <div style={{ ...containerStyle, display: "block" }}>{renderDemo()}</div>;
  }

  return (
    <div style={containerStyle}>
      <aside style={sidebarStyle}>
        <div style={titleStyle}>响应式系统测试</div>
        {categories.map((category) => (
          <div key={category.name}>
            <div style={categoryStyle}>{category.name}</div>
            {category.demos.map((demo, index) => (
              <div
                key={demo.id}
                onClick={() => setCurrentDemo(demo.id as DemoType)}
                style={{
                  ...itemStyle,
                  ...(currentDemo === demo.id ? activeItemStyle : {}),
                }}
              >
                {index + 1}.{demo.name}
              </div>
            ))}
          </div>
        ))}
      </aside>

      <main style={mainStyle}>{renderDemo()}</main>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  fontFamily: "monospace",
  minHeight: "100vh",
  background: "#fff",
  display: "flex",
};

const sidebarStyle: React.CSSProperties = {
  width: "180px",
  borderRight: "1px solid #ddd",
  padding: "8px 0",
  flexShrink: 0,
};

const titleStyle: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  padding: "6px 12px",
  borderBottom: "1px solid #ddd",
  marginBottom: "4px",
};

const categoryStyle: React.CSSProperties = {
  fontSize: "13px",
  padding: "6px 12px 2px 12px",
  color: "#666",
  borderTop: "1px solid #eee",
  marginTop: "4px",
};

const itemStyle: React.CSSProperties = {
  fontSize: "14px",
  padding: "4px 12px 4px 20px",
  cursor: "pointer",
  borderLeft: "2px solid transparent",
};

const activeItemStyle: React.CSSProperties = {
  background: "#f5f5f5",
  borderLeftColor: "#999",
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  overflow: "auto",
};

export default Home;
