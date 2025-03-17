import React, { useRef, useState } from "react";
import "./Style/index.scss";
import { CacheGroup, CacheGroupRef } from "./components/CacheDom/CacheGroup";
import { CacheDom } from "./components/CacheDom/CacheDom";
import { Button, Card, Divider, Space, Switch, Input, message, Tag } from "antd";
import type { ISafeAny } from "./types";

const App: React.FC = () => {
  // 控制组件显示状态
  const [isShow1, setIsShow1] = useState<boolean>(false);
  const [isShow2, setIsShow2] = useState<boolean>(false);
  const [isShow3, setIsShow3] = useState<boolean>(false);

  // 依赖状态
  const [name, setName] = useState<string>("测试组件");
  const [count, setCount] = useState<number>(0);
  const [color, setColor] = useState<string>("blue");

  // 禁用缓存控制
  const [disableCache, setDisableCache] = useState<boolean>(false);

  // CacheGroup ref
  const cacheGroupRef = useRef<CacheGroupRef>(null);

  // 缓存命中计数
  const [hitCount, setHitCount] = useState<number>(0);
  const [missCount, setMissCount] = useState<number>(0);

  // 清除指定缓存
  const clearSpecificCache = () => {
    cacheGroupRef.current?.clearCache("test-dom-1");
    message.success("已清除组件1的缓存");
  };

  // 清除所有缓存
  const clearAllCache = () => {
    cacheGroupRef.current?.clearCache();
    message.success("已清除所有缓存");
  };

  // 获取当前缓存的键
  const showCacheKeys = () => {
    const keys = cacheGroupRef.current?.getCacheKeys() || [];
    message.info(`当前缓存的键: ${keys.join(", ") || "无"}`);
  };
  console.log("执行更新");

  return (
    <div className="app-container" style={{ padding: 20 }}>
      <h1>CacheDom 组件功能演示</h1>

      <CacheGroup groupId="demo-group" capacity={5} ref={cacheGroupRef}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Card title="基本缓存功能演示" bordered>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space>
                <Button type="primary" onClick={() => setIsShow1(!isShow1)}>
                  {isShow1 ? "隐藏组件1" : "显示组件1"}
                </Button>
                <Button onClick={() => setCount(count + 1)}>更新组件传入参数：计数: {count}</Button>
                <Button onClick={() => setName((prev) => prev + "!")}>更新名称</Button>
              </Space>

              {isShow1 && (
                <CacheDom
                  cacheKey="test-dom-1"
                  Component={TestComponent}
                  deps={{ name, count }}
                  onCacheHit={() => {
                    message.success(`组件：${name} 命中`);
                  }}
                  onCacheMiss={() => {
                    message.warning(`组件：${name} 未命中`);
                  }}
                  containerClassName="custom-container"
                  containerStyle={{ border: "1px dashed #ccc", padding: 16, borderRadius: 8 }}
                />
              )}
            </Space>
          </Card>

          <Card title="禁用缓存演示" bordered>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space>
                <Button type="primary" onClick={() => setIsShow2(!isShow2)}>
                  {isShow2 ? "隐藏组件2" : "显示组件2"}
                </Button>
                <span>禁用缓存:</span>
                <Switch checked={disableCache} onChange={setDisableCache} />
              </Space>

              {isShow2 && (
                <CacheDom
                  cacheKey="test-dom-2"
                  Component={TestComponent}
                  deps={{ name: "禁用缓存测试", count }}
                  disabled={disableCache}
                />
              )}
            </Space>
          </Card>

          <Card title="自定义样式演示" bordered>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space>
                <Button type="primary" onClick={() => setIsShow3(!isShow3)}>
                  {isShow3 ? "隐藏组件3" : "显示组件3"}
                </Button>
                <span>背景颜色:</span>
                <Button onClick={() => setColor("red")}>红色</Button>
                <Button onClick={() => setColor("green")}>绿色</Button>
                <Button onClick={() => setColor("blue")}>蓝色</Button>
              </Space>

              {isShow3 && (
                <CacheDom
                  cacheKey="test-dom-3"
                  Component={ColorComponent}
                  deps={{ color }}
                  containerClassName="styled-container"
                  containerStyle={{
                    padding: 16,
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              )}
            </Space>
          </Card>

          <Card title="缓存管理" bordered>
            <Space>
              <Button onClick={clearSpecificCache}>清除组件1缓存</Button>
              <Button danger onClick={clearAllCache}>
                清除所有缓存
              </Button>
              <Button type="dashed" onClick={showCacheKeys}>
                显示当前缓存键
              </Button>
            </Space>
            <Divider />
            <div>
              <span>缓存命中次数: </span>
              <Tag color="green">{hitCount}</Tag>
            </div>
            <div>
              <span>缓存未命中次数: </span>
              <Tag color="orange">{missCount}</Tag>
            </div>
          </Card>
        </Space>
      </CacheGroup>
    </div>
  );
};

// 测试组件
const TestComponent: React.FC<{ name: string; count: number }> = (props) => {
  const { name, count } = props;
  const [localCount, setLocalCount] = useState<number>(0);
  const mountTime = useRef<string>(new Date().toLocaleTimeString()).current;

  return (
    <div>
      <h3>{name}</h3>
      <p>组件挂载时间: {mountTime}</p>
      <p>外部计数: {count}</p>
      <p>内部计数: {localCount}</p>
      <Button onClick={() => setLocalCount((prev) => prev + 1)}>增加内部计数</Button>
    </div>
  );
};

// 颜色组件
const ColorComponent: React.FC<{ color: string }> = ({ color }) => {
  const [text, setText] = useState<string>("");

  return (
    <div style={{ backgroundColor: color, padding: 16, color: "white", borderRadius: 4 }}>
      <h3>颜色组件</h3>
      <p>当前颜色: {color}</p>
      <Input
        placeholder="输入文本"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <p>输入的文本: {text}</p>
    </div>
  );
};

export default App;
