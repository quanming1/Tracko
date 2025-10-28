import React from "react";
import { useStores } from "../stores";
import { StoreInspector } from "../components/StoreInspector";

const NestedLevel1: React.FC = () => {
  const { counterStore } = useStores();

  return (
    <div style={level1Style}>
      <div style={labelStyle}>
        L1: count={counterStore.count} double(c)={counterStore.double}{" "}
        <StoreInspector storeName="counterStore" store={counterStore} />
      </div>
      <button onClick={() => (counterStore.count += 1)} style={btnStyle}>
        count+1
      </button>
    </div>
  );
};

const NestedLevel2: React.FC = () => {
  const { counterStore } = useStores();

  return (
    <div style={level2Style}>
      <div style={labelStyle}>L2: quadruple(c)={counterStore.quadruple}</div>
      <button onClick={() => (counterStore.count += 1)} style={btnStyle}>
        count+1
      </button>
    </div>
  );
};

const NestedLevel3: React.FC = () => {
  const { counterStore } = useStores();

  return (
    <div style={level3Style}>
      <div style={labelStyle}>
        L3: octuple(c)={counterStore.octuple} (count→double→quadruple→octuple)
      </div>
      <button onClick={() => (counterStore.count += 1)} style={btnStyle}>
        count+1
      </button>
    </div>
  );
};

export const Demo3: React.FC = () => {
  return (
    <div style={containerStyle}>
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
