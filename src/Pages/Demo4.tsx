import React, { useRef } from "react";
import { useStores } from "../stores";
import { StoreInspector } from "../components/StoreInspector";
import { FlashBox } from "../components/FlashBox";

const OnlyCounterComponent: React.FC = () => {
  const { counterStore } = useStores();
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log("[A] OnlyCounterComponent 渲染", renderCount.current);

  return (
    <FlashBox deps={[counterStore.count]} style={compAStyle}>
      <div style={dataStyle}>
        [A] counterStore.count={counterStore.count} | renders:{renderCount.current}
      </div>
      <button onClick={() => (counterStore.count += 1)} style={btnStyle}>
        count+1
      </button>
    </FlashBox>
  );
};

const OnlyUserComponent: React.FC = () => {
  const { userStore } = useStores();
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log("[B] OnlyUserComponent 渲染", renderCount.current);

  return (
    <FlashBox deps={[userStore.name]} style={compBStyle}>
      <div style={dataStyle}>
        [B] userStore.name={userStore.name} | renders:{renderCount.current}
      </div>
      <button onClick={() => (userStore.name = "用户_" + Date.now())} style={btnStyle}>
        change name
      </button>
    </FlashBox>
  );
};

const OnlyUserAgeComponent: React.FC = () => {
  const { userStore } = useStores();
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log("[C] OnlyUserAgeComponent 渲染", renderCount.current);

  return (
    <FlashBox deps={[userStore.age]} style={compCStyle}>
      <div style={dataStyle}>
        [C] userStore.age={userStore.age} | renders:{renderCount.current}
      </div>
      <button onClick={() => (userStore.age += 1)} style={btnStyle}>
        age+1
      </button>
    </FlashBox>
  );
};

const OnlyProfileEmailComponent: React.FC = () => {
  const { userStore } = useStores();
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log("[D] OnlyProfileEmailComponent 渲染", renderCount.current);

  return (
    <FlashBox style={compDStyle}>
      <div style={dataStyle}>
        [D] userStore.profile.email={userStore.profile.email} | renders:{renderCount.current}
      </div>
      <button
        onClick={() => (userStore.profile.email = `email${Date.now()}@test.com`)}
        style={btnStyle}
      >
        change email
      </button>
    </FlashBox>
  );
};

const OnlyProfilePhoneComponent: React.FC = () => {
  const { userStore } = useStores();
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log("[E] OnlyProfilePhoneComponent 渲染", renderCount.current);

  return (
    <FlashBox style={compEStyle}>
      <div style={dataStyle}>
        [E] userStore.profile.phone={userStore.profile.phone} | renders:{renderCount.current}
      </div>
      <button
        onClick={() => (userStore.profile.phone = `138${Date.now().toString().slice(-8)}`)}
        style={btnStyle}
      >
        change phone
      </button>
    </FlashBox>
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

      <div style={sectionStyle}>
        <div style={labelStyle}>
          Q: store下有一个字段是对象，两个组件分别使用对象中的不同字段，能否实现细颗粒度更新？
        </div>
        <div style={dataStyle}>A: 不行，最小颗粒度是store下的一级字段</div>
        <div style={dataStyle}>
          实际: 点[D]按钮修改profile.email→[D]和[E]都重渲染 |
          点[E]按钮修改profile.phone→[D]和[E]都重渲染
        </div>
      </div>

      <OnlyProfileEmailComponent />
      <OnlyProfilePhoneComponent />
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

const compDStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "6px",
  marginBottom: "4px",
};

const compEStyle: React.CSSProperties = {
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
