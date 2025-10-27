import React, { useState } from "react";
import { makeAutoObservable } from "../lib/makeAutoObservable";

// 测试场景1: Computed循环依赖
class CircularComputedStore {
  value = 10;

  // 尝试创建循环依赖: a 依赖 b, b 依赖 a
  get computedA() {
    console.log("计算 computedA (尝试依赖 computedB)");
    // 如果取消注释下面这行，会导致无限循环
    // return this.computedB + 1;
    return this.value + 1;
  }

  get computedB() {
    console.log("计算 computedB (尝试依赖 computedA)");
    // 如果取消注释下面这行，会导致无限循环
    // return this.computedA + 1;
    return this.value + 2;
  }
}

// 测试场景2: 在Getter中修改依赖的属性
class GetterModifiesStore {
  count = 0;
  accessCount = 0;

  get dangerous() {
    console.log("计算 dangerous getter");
    // 危险操作：在getter中修改属性
    // 如果取消注释下面这行，可能导致循环
    // this.accessCount++;
    return this.count * 2;
  }
}

// 测试场景3: Setter连锁反应
class ChainReactionStore {
  valueA = 1;
  valueB = 2;
  depth = 0;

  get computedFromA() {
    console.log("计算 computedFromA");
    return this.valueA * 10;
  }

  // 危险：setter中读取computed，可能触发连锁反应
  setValueA = (val: number) => {
    console.log("setValueA 被调用:", val);
    this.depth++;

    // 防止无限递归的保护
    if (this.depth > 10) {
      console.error("检测到深度递归，停止!");
      this.depth = 0;
      return;
    }

    this.valueA = val;

    // 危险：在setter中读取computed并触发另一个setter
    // 如果取消注释，可能导致循环
    // const computed = this.computedFromA;
    // if (computed > 100) {
    //   this.valueB = computed;
    // }

    this.depth--;
  };
}

// 测试场景4: 多层computed依赖链可能导致性能问题
class DeepComputedStore {
  base = 1;

  get level1() {
    console.log("计算 level1");
    return this.base * 2;
  }

  get level2() {
    console.log("计算 level2");
    return this.level1 * 2;
  }

  get level3() {
    console.log("计算 level3");
    return this.level2 * 2;
  }

  get level4() {
    console.log("计算 level4");
    return this.level3 * 2;
  }

  get level5() {
    console.log("计算 level5");
    return this.level4 * 2;
  }

  // 危险：如果这里再依赖回base或其他属性，可能形成复杂的依赖网
  get dangerous() {
    console.log("计算 dangerous (依赖多个level)");
    // 如果有复杂的条件逻辑，可能导致意外的循环
    return this.level5 + this.level3 + this.level1;
  }
}

// 测试场景5: 真正的循环依赖 - 这个会立即触发死循环
class RealCircularStore {
  value = 10;

  get circularA(): number {
    console.log("计算 circularA");
    // 立即触发死循环
    return this.circularB + 1;
  }

  get circularB(): number {
    console.log("计算 circularB");
    // 立即触发死循环
    return this.circularA + 1;
  }
}

export const Demo5: React.FC = () => {
  const [store1] = useState(() => makeAutoObservable(new CircularComputedStore()));
  const [store2] = useState(() => makeAutoObservable(new GetterModifiesStore()));
  const [store3] = useState(() => makeAutoObservable(new ChainReactionStore()));
  const [store4] = useState(() => makeAutoObservable(new DeepComputedStore()));
  const [dangerousStore, setDangerousStore] = useState<any>(null);
  const [error, setError] = useState<string>("");

  // 测试循环依赖
  const testCircularDependency = () => {
    console.clear();
    console.log("=== 测试场景1: 安全的独立Computed ===");
    console.log("computedA:", store1.computedA);
    console.log("computedB:", store1.computedB);
    alert("查看控制台输出，当前是安全的独立computed");
  };

  // 测试Getter修改属性
  const testGetterModifies = () => {
    console.clear();
    console.log("=== 测试场景2: Getter中读取属性 ===");
    console.log("dangerous:", store2.dangerous);
    console.log("accessCount:", store2.accessCount);
    alert("查看控制台输出，如果在getter中修改accessCount会导致循环");
  };

  // 测试Setter连锁反应
  const testChainReaction = () => {
    console.clear();
    console.log("=== 测试场景3: Setter连锁反应 ===");
    store3.setValueA(50);
    console.log("valueA:", store3.valueA);
    console.log("valueB:", store3.valueB);
    alert("查看控制台输出，注意深度保护机制");
  };

  // 测试深层依赖
  const testDeepComputed = () => {
    console.clear();
    console.log("=== 测试场景4: 深层Computed依赖链 ===");
    console.log("level5:", store4.level5);
    console.log("dangerous (多依赖):", store4.dangerous);
    store4.base = 2;
    console.log("修改base后，level5:", store4.level5);
    alert("查看控制台输出，注意computed的级联计算");
  };

  // 危险测试：真正的循环依赖
  const testRealCircular = () => {
    if (!window.confirm("警告：这会导致真正的死循环，可能会卡死浏览器！确定要测试吗？")) {
      return;
    }

    console.clear();
    console.log("=== 测试场景5: 真正的循环依赖 (危险!) ===");

    try {
      const dangerous = makeAutoObservable(new RealCircularStore());
      setDangerousStore(dangerous);

      // 尝试访问循环依赖的属性
      setTimeout(() => {
        try {
          console.log("尝试访问 circularA...");
          const result = dangerous.circularA;
          console.log("结果:", result);
        } catch (err: any) {
          console.error("捕获到错误:", err.message);
          setError("循环依赖错误: " + err.message);
        }
      }, 100);
    } catch (err: any) {
      console.error("初始化错误:", err.message);
      setError("初始化错误: " + err.message);
    }
  };

  // 测试修改导致重复计算
  const testRepeatComputation = () => {
    console.clear();
    console.log("=== 测试场景6: 快速修改导致重复计算 ===");

    for (let i = 0; i < 5; i++) {
      store1.value = i;
      console.log(`第${i}次修改，computedA:`, store1.computedA);
    }

    alert("查看控制台输出，注意computed的缓存机制");
  };

  // 测试给computed属性赋值
  const testAssignToComputed = () => {
    console.clear();
    console.log("=== 测试场景7: 尝试给Computed属性赋值 ===");

    console.log("当前 computedA:", store1.computedA);
    console.log("尝试执行: store1.computedA = 999");

    // 尝试给computed属性赋值
    (store1 as any).computedA = 999;

    console.log("赋值后 computedA:", store1.computedA);
    console.log("注意：computed属性是只读的，赋值操作被忽略");

    alert("查看控制台输出，应该看到警告信息");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px" }}>
      <h2>Demo5: Store死循环测试</h2>
      <p style={{ color: "#ff4d4f", marginBottom: "20px", fontWeight: "bold" }}>
        ⚠️ 警告：某些测试可能会导致浏览器卡死，请谨慎测试！
      </p>

      {error && (
        <div
          style={{
            background: "#fff1f0",
            border: "1px solid #ffa39e",
            padding: "15px",
            borderRadius: "4px",
            marginBottom: "20px",
            color: "#cf1322",
          }}
        >
          <strong>错误:</strong> {error}
        </div>
      )}

      <div style={{ marginBottom: "30px" }}>
        <h3>测试场景概览</h3>
        <ul style={{ lineHeight: "1.8" }}>
          <li>
            <strong>场景1:</strong> Computed循环依赖（已注释危险代码）
          </li>
          <li>
            <strong>场景2:</strong> 在Getter中修改依赖属性（已注释危险代码）
          </li>
          <li>
            <strong>场景3:</strong> Setter连锁反应（有保护机制）
          </li>
          <li>
            <strong>场景4:</strong> 深层Computed依赖链
          </li>
          <li>
            <strong>场景5:</strong> 真正的循环依赖（危险！会卡死）
          </li>
          <li>
            <strong>场景6:</strong> 快速修改测试缓存机制
          </li>
          <li>
            <strong>场景7:</strong> 尝试给Computed属性赋值（应该被警告并忽略）
          </li>
        </ul>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <button onClick={testCircularDependency} style={safeButtonStyle}>
          测试场景1: 独立Computed (安全)
        </button>

        <button onClick={testGetterModifies} style={safeButtonStyle}>
          测试场景2: Getter读取 (安全)
        </button>

        <button onClick={testChainReaction} style={safeButtonStyle}>
          测试场景3: Setter连锁 (安全)
        </button>

        <button onClick={testDeepComputed} style={safeButtonStyle}>
          测试场景4: 深层依赖 (安全)
        </button>

        <button onClick={testRealCircular} style={dangerButtonStyle}>
          测试场景5: 真循环依赖 (⚠️危险)
        </button>

        <button onClick={testRepeatComputation} style={safeButtonStyle}>
          测试场景6: 重复计算 (安全)
        </button>

        <button onClick={testAssignToComputed} style={safeButtonStyle}>
          测试场景7: 给Computed赋值 (安全)
        </button>
      </div>

      <div
        style={{ marginTop: "40px", padding: "20px", background: "#f0f2f5", borderRadius: "8px" }}
      >
        <h3>当前状态</h3>

        <div style={{ marginBottom: "15px" }}>
          <h4>Store1 (CircularComputed):</h4>
          <pre style={preStyle}>
            value: {store1.value}
            {"\n"}computedA: {store1.computedA}
            {"\n"}computedB: {store1.computedB}
          </pre>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4>Store2 (GetterModifies):</h4>
          <pre style={preStyle}>
            count: {store2.count}
            {"\n"}accessCount: {store2.accessCount}
            {"\n"}dangerous: {store2.dangerous}
          </pre>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4>Store3 (ChainReaction):</h4>
          <pre style={preStyle}>
            valueA: {store3.valueA}
            {"\n"}valueB: {store3.valueB}
            {"\n"}depth: {store3.depth}
          </pre>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4>Store4 (DeepComputed):</h4>
          <pre style={preStyle}>
            base: {store4.base}
            {"\n"}level1: {store4.level1}
            {"\n"}level5: {store4.level5}
          </pre>
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "#fff7e6",
          border: "1px solid #ffd591",
          borderRadius: "4px",
        }}
      >
        <h4>💡 死循环产生的原因分析：</h4>
        <ol style={{ marginTop: "10px", lineHeight: "1.8" }}>
          <li>
            <strong>Computed循环依赖:</strong> A.getter 读取 B.getter，B.getter 读取 A.getter →
            无限递归
          </li>
          <li>
            <strong>Getter修改依赖:</strong> getter 中修改属性 → 触发notify → 重新计算getter →
            又修改属性
          </li>
          <li>
            <strong>Setter连锁:</strong> setA → 读computed → computed依赖B → setB → 读computed →
            又触发setA
          </li>
          <li>
            <strong>组件重渲染循环:</strong> render → 修改store → notify → forceUpdate → render
          </li>
        </ol>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "#e6f7ff",
          border: "1px solid #91d5ff",
          borderRadius: "4px",
        }}
      >
        <h4>🛡️ 当前实现的保护机制：</h4>
        <ul style={{ marginTop: "10px", lineHeight: "1.8" }}>
          <li>✅ makeAutoObservable.ts 第35行：检测 computedStack 中是否已包含当前computed</li>
          <li>⚠️ 但这只能检测直接递归，无法检测 A→B→A 这种循环</li>
          <li>💡 建议添加：最大调用深度限制、循环检测算法</li>
        </ul>
      </div>
    </div>
  );
};

const safeButtonStyle: React.CSSProperties = {
  padding: "12px 20px",
  background: "#1890ff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
};

const dangerButtonStyle: React.CSSProperties = {
  padding: "12px 20px",
  background: "#ff4d4f",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
};

const preStyle: React.CSSProperties = {
  background: "white",
  padding: "10px",
  borderRadius: "4px",
  fontSize: "13px",
  margin: "5px 0 0 0",
};
