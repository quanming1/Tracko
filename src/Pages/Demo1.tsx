import React from "react";
import { useStores } from "../stores";
import { StoreInspector } from "../components/StoreInspector";

export const Demo1: React.FC = () => {
  const { counterStore } = useStores();

  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <div style={labelStyle}>
          数字操作 <StoreInspector storeName="counterStore" store={counterStore} />
        </div>
        <div style={dataStyle}>count:{counterStore.count}</div>
        <div>
          <button onClick={() => (counterStore.count += 1)} style={btnStyle}>
            +1
          </button>
          <button onClick={() => (counterStore.count -= 1)} style={btnStyle}>
            -1
          </button>
          <button onClick={() => (counterStore.count += 10)} style={btnStyle}>
            +10
          </button>
          <button onClick={() => (counterStore.count -= 10)} style={btnStyle}>
            -10
          </button>
          <button onClick={() => (counterStore.count = 0)} style={btnStyle}>
            reset
          </button>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>数组操作(改变原数组)</div>
        <div style={dataStyle}>
          history:[{counterStore.history.join(",")}] length:{counterStore.history.length}
        </div>
        <div>
          <button onClick={() => counterStore.history.push(counterStore.count)} style={btnStyle}>
            push(count)
          </button>
          <button onClick={() => counterStore.history.pop()} style={btnStyle}>
            pop()
          </button>
          <button onClick={() => counterStore.history.shift()} style={btnStyle}>
            shift()
          </button>
          <button onClick={() => counterStore.history.unshift(0)} style={btnStyle}>
            unshift(0)
          </button>
          <button onClick={() => counterStore.history.reverse()} style={btnStyle}>
            reverse()
          </button>
          <button onClick={() => counterStore.history.sort((a, b) => a - b)} style={btnStyle}>
            sort()
          </button>
          <button
            onClick={() => {
              if (counterStore.history.length > 0) {
                counterStore.history.splice(0, 1, 999);
              }
            }}
            style={btnStyle}
          >
            splice(0,1,999)
          </button>
          <button onClick={() => (counterStore.history = [])} style={btnStyle}>
            clear
          </button>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>深度嵌套(数组→对象→数组→对象→数组)</div>
        <pre style={preStyle}>{JSON.stringify(counterStore.items, null, 2)}</pre>
        <div style={{ marginBottom: "4px" }}>
          <div style={labelStyle}>L1.数组操作:</div>
          <button
            onClick={() =>
              counterStore.items.push({
                id: Date.now(),
                name: "new",
                subItems: [],
              })
            }
            style={btnStyle}
          >
            items.push({})
          </button>
          <button onClick={() => counterStore.items.pop()} style={btnStyle}>
            items.pop()
          </button>
        </div>
        <div style={{ marginBottom: "4px" }}>
          <div style={labelStyle}>L2.对象属性:</div>
          <button
            onClick={() => {
              if (counterStore.items[0]) {
                counterStore.items[0].name += "!";
              }
            }}
            style={btnStyle}
          >
            items[0].name+="!"
          </button>
          <button
            onClick={() => {
              if (counterStore.items[0]) {
                counterStore.items[0].id++;
              }
            }}
            style={btnStyle}
          >
            items[0].id++
          </button>
        </div>
        <div style={{ marginBottom: "4px" }}>
          <div style={labelStyle}>L3.数组操作:</div>
          <button
            onClick={() => {
              if (counterStore.items[0]) {
                counterStore.items[0].subItems.push({ label: "new", data: [] });
              }
            }}
            style={btnStyle}
          >
            items[0].subItems.push({})
          </button>
          <button
            onClick={() => {
              if (counterStore.items[0]?.subItems.length) {
                counterStore.items[0].subItems.pop();
              }
            }}
            style={btnStyle}
          >
            items[0].subItems.pop()
          </button>
        </div>
        <div style={{ marginBottom: "4px" }}>
          <div style={labelStyle}>L4.对象属性:</div>
          <button
            onClick={() => {
              if (counterStore.items[0]?.subItems[0]) {
                counterStore.items[0].subItems[0].label += "*";
              }
            }}
            style={btnStyle}
          >
            items[0].subItems[0].label+="*"
          </button>
        </div>
        <div style={{ marginBottom: "4px" }}>
          <div style={labelStyle}>L5.数组操作:</div>
          <button
            onClick={() => {
              if (counterStore.items[0]?.subItems[0]) {
                counterStore.items[0].subItems[0].data.push(999);
              }
            }}
            style={btnStyle}
          >
            items[0].subItems[0].data.push(999)
          </button>
          <button
            onClick={() => {
              if (counterStore.items[0]?.subItems[0]?.data.length) {
                counterStore.items[0].subItems[0].data.pop();
              }
            }}
            style={btnStyle}
          >
            items[0].subItems[0].data.pop()
          </button>
          <button
            onClick={() => {
              if (counterStore.items[0]?.subItems[0]?.data.length) {
                counterStore.items[0].subItems[0].data[0]++;
              }
            }}
            style={btnStyle}
          >
            items[0].subItems[0].data[0]++
          </button>
        </div>
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
  marginBottom: "4px",
  lineHeight: "1.4",
};

const preStyle: React.CSSProperties = {
  fontSize: "13px",
  background: "#f5f5f5",
  padding: "4px",
  margin: "4px 0",
  border: "1px solid #ddd",
  maxHeight: "200px",
  overflow: "auto",
};

const btnStyle: React.CSSProperties = {
  margin: "2px",
  padding: "4px 8px",
  background: "#fff",
  color: "#333",
  border: "1px solid #ccc",
  cursor: "pointer",
  fontSize: "13px",
  fontFamily: "monospace",
};
