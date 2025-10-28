import React from "react";
import { useStores } from "../stores";
import { StoreInspector } from "../components/StoreInspector";
import { FlashBox } from "../components/FlashBox";

const NestedLevel1: React.FC = () => {
  const { counterStore } = useStores();

  return (
    <FlashBox deps={[counterStore.count, counterStore.double]} style={level1Style}>
      <div style={labelStyle}>
        L1: count={counterStore.count} double(c)={counterStore.double}{" "}
        <StoreInspector storeName="counterStore" store={counterStore} />
      </div>
      <button onClick={() => (counterStore.count += 1)} style={btnStyle}>
        count+1
      </button>
    </FlashBox>
  );
};

const NestedLevel2: React.FC = () => {
  const { counterStore } = useStores();

  return (
    <FlashBox deps={[counterStore.quadruple]} style={level2Style}>
      <div style={labelStyle}>L2: quadruple(c)={counterStore.quadruple}</div>
      <button onClick={() => (counterStore.count += 1)} style={btnStyle}>
        count+1
      </button>
    </FlashBox>
  );
};

const NestedLevel3: React.FC = () => {
  const { counterStore } = useStores();

  return (
    <FlashBox deps={[counterStore.octuple]} style={level3Style}>
      <div style={labelStyle}>
        L3: octuple(c)={counterStore.octuple} (count→double→quadruple→octuple)
      </div>
      <button onClick={() => (counterStore.count += 1)} style={btnStyle}>
        count+1
      </button>
    </FlashBox>
  );
};

export const Demo3: React.FC = () => {
  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <div style={labelStyle}>
          Q:
          computed属性链式依赖(count→double→quadruple→octuple)，点击任一按钮+1，会触发几次重渲染？
        </div>
        <div style={dataStyle}>
          A:
          触发3次重渲染，L1组件依赖count和double都变化会闪烁，L2组件依赖quadruple会闪烁，L3组件依赖octuple会闪烁
        </div>
      </div>

      <NestedLevel1 />
      <NestedLevel2 />
      <NestedLevel3 />
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  padding: "8px",
  fontFamily: "monospace",
  fontSize: "11px",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: "8px",
  paddingBottom: "8px",
  borderBottom: "1px solid #ddd",
};

const dataStyle: React.CSSProperties = {
  marginBottom: "2px",
  lineHeight: "1.4",
};

const level1Style: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "6px",
  marginBottom: "4px",
};

const level2Style: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "6px",
  marginLeft: "16px",
  marginBottom: "4px",
};

const level3Style: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "6px",
  marginLeft: "32px",
  marginBottom: "4px",
};

const labelStyle: React.CSSProperties = {
  marginBottom: "4px",
};

const btnStyle: React.CSSProperties = {
  margin: "2px",
  padding: "2px 6px",
  background: "#fff",
  color: "#333",
  border: "1px solid #ccc",
  cursor: "pointer",
  fontSize: "10px",
  fontFamily: "monospace",
};
