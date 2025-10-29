import React, { useState } from "react";

export const DemoReliabilityMemory: React.FC = () => {
  const [testDuration, setTestDuration] = useState(30);

  const openMobXTest = () => {
    const mobxWindow = window.open(
      window.location.origin + `/?test=mobx-memory&duration=${testDuration}`,
      "MobX Memory Test",
      "width=800,height=600,left=100,top=100",
    );

    if (!mobxWindow) {
      alert("无法打开测试窗口，请允许弹窗");
    }
  };

  const openMyStoreTest = () => {
    const myStoreWindow = window.open(
      window.location.origin + `/?test=mystore-memory&duration=${testDuration}`,
      "MyStore Memory Test",
      "width=800,height=600,left=920,top=100",
    );

    if (!myStoreWindow) {
      alert("无法打开测试窗口，请允许弹窗");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <div style={labelStyle}>内存占用对比测试</div>
        <div style={dataStyle}>测试内容: 复杂嵌套数据结构大量CRUD操作</div>
        <div style={dataStyle}>数据规模: 5000用户 + 2500产品 (含长文本字段)</div>
        <div style={dataStyle}>字段数量: 用户30+字段, 产品25+字段</div>
        <div style={dataStyle}>
          测试时长:
          <input
            type="number"
            value={testDuration}
            onChange={(e) => setTestDuration(Number(e.target.value))}
            min={1}
            max={120}
            style={inputStyle}
          />
          分钟
        </div>
        <div style={dataStyle}>对比对象: MobX vs 自研Store</div>
        <div style={dataStyle}>监控指标: JS Heap内存占用</div>
      </div>

      <div style={sectionStyle}>
        <button onClick={openMobXTest} style={btnStyle}>
          打开 MobX 测试窗口
        </button>
        <button onClick={openMyStoreTest} style={btnStyle}>
          打开 自研Store 测试窗口
        </button>
      </div>

      <div style={infoStyle}>
        <div style={labelStyle}>测试说明:</div>
        <div style={dataStyle}>1. 分别点击两个按钮，打开独立测试窗口</div>
        <div style={dataStyle}>2. 每个窗口会自动开始相同的测试</div>
        <div style={dataStyle}>3. 每秒记录一次内存占用，用echarts实时展示</div>
        <div style={dataStyle}>4. 测试完成后可对比两者的内存占用曲线</div>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  padding: "8px",
  fontFamily: "monospace",
  fontSize: "14px",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: "12px",
  borderBottom: "1px solid #ddd",
  paddingBottom: "8px",
};

const labelStyle: React.CSSProperties = {
  fontWeight: "600",
  marginBottom: "4px",
};

const dataStyle: React.CSSProperties = {
  marginBottom: "2px",
  lineHeight: "1.4",
};

const infoStyle: React.CSSProperties = {
  marginTop: "8px",
  paddingTop: "8px",
  borderTop: "1px solid #ddd",
};

const inputStyle: React.CSSProperties = {
  width: "60px",
  padding: "4px 6px",
  margin: "0 6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  fontFamily: "monospace",
};

const btnStyle: React.CSSProperties = {
  margin: "2px",
  padding: "6px 12px",
  background: "#fff",
  color: "#333",
  border: "1px solid #ccc",
  cursor: "pointer",
  fontSize: "14px",
  fontFamily: "monospace",
};
