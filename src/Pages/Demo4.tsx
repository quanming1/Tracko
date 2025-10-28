import React, { useRef } from "react";
import { useStores } from "../stores";
import { StoreInspector } from "../components/StoreInspector";

const OnlyCounterComponent: React.FC = () => {
  const { counterStore } = useStores();
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log("[A] OnlyCounterComponent 渲染", renderCount.current);

  return (
    <div style={compAStyle}>
      <div style={dataStyle}>
        [A] counterStore.count={counterStore.count} | renders:{renderCount.current}
      </div>
      <button onClick={() => (counterStore.count += 1)} style={btnStyle}>
        count+1
      </button>
    </div>
  );
};

const OnlyUserComponent: React.FC = () => {
  const { userStore } = useStores();
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log("[B] OnlyUserComponent 渲染", renderCount.current);

  return (
    <div style={compBStyle}>
      <div style={dataStyle}>
        [B] userStore.name={userStore.name} | renders:{renderCount.current}
      </div>
      <button onClick={() => (userStore.name = "用户_" + Date.now())} style={btnStyle}>
        change name
      </button>
    </div>
  );
};

const OnlyUserAgeComponent: React.FC = () => {
  const { userStore } = useStores();
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log("[C] OnlyUserAgeComponent 渲染", renderCount.current);

  return (
    <div style={compCStyle}>
      <div style={dataStyle}>
        [C] userStore.age={userStore.age} | renders:{renderCount.current}
      </div>
      <button onClick={() => (userStore.age += 1)} style={btnStyle}>
        age+1
      </button>
    </div>
  );
};

export const Demo4: React.FC = () => {
  const { counterStore, userStore } = useStores();
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        parent renders:{renderCount.current}{" "}
        <StoreInspector storeName="counterStore" store={counterStore} />{" "}
        <StoreInspector storeName="userStore" store={userStore} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>
          理想: 点[A]按钮→仅[A]重渲染 | 点[B]按钮→仅[B]重渲染 | 点[C]按钮→仅[C]重渲染
        </div>
      </div>

      <OnlyCounterComponent />
      <OnlyUserComponent />
      <OnlyUserAgeComponent />
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  padding: "8px",
  fontFamily: "monospace",
  fontSize: "11px",
};

const headerStyle: React.CSSProperties = {
  fontWeight: "600",
  marginBottom: "8px",
  paddingBottom: "4px",
  borderBottom: "1px solid #ddd",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: "8px",
  paddingBottom: "8px",
  borderBottom: "1px solid #ddd",
};

const labelStyle: React.CSSProperties = {
  marginBottom: "2px",
};

const dataStyle: React.CSSProperties = {
  marginBottom: "2px",
  lineHeight: "1.4",
};

const compAStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "6px",
  marginBottom: "4px",
};

const compBStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "6px",
  marginBottom: "4px",
};

const compCStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "6px",
  marginBottom: "4px",
};

const infoStyle: React.CSSProperties = {
  marginTop: "8px",
  paddingTop: "8px",
  borderTop: "1px solid #ddd",
};

const solutionStyle: React.CSSProperties = {
  marginTop: "8px",
  paddingTop: "8px",
  borderTop: "1px solid #ddd",
};

const preStyle: React.CSSProperties = {
  fontSize: "10px",
  background: "#f5f5f5",
  padding: "4px",
  margin: "4px 0",
  border: "1px solid #ddd",
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
