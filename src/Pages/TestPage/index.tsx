import React, { useState, useRef, useCallback } from "react";
import { message } from "antd";
import { CacheGroup, CacheGroupRef } from "../../components/CacheDom/CacheGroup";
import { CacheDom } from "../../components/CacheDom/CacheDom";
import styles from "./index.module.scss";
import { AppstoreOutlined, FileTextOutlined, PictureOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons";
// 导入组件
import {
  // @ts-ignore
  ChartComponent,
  // @ts-ignore
  TableComponent,
  // @ts-ignore
  FormComponent,
  // @ts-ignore
  ControlPanel,
  // @ts-ignore
  InstructionCard,
  // @ts-ignore
  TabButton,
  // @ts-ignore
  ChartIcon,
  // @ts-ignore
  TableIcon,
  // @ts-ignore
  FormIcon,
} from "./components";

const TestPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [cacheDisabled, setCacheDisabled] = useState(false);
  const [count, setCount] = useState(0);
  const [cacheKey, setCacheKey] = useState("tab1");
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const cacheGroupRef = useRef<CacheGroupRef>(null);

  // 缓存命中回调
  const handleCacheHit = useCallback((name: string) => {
    setHitCount((prev) => prev + 1);
    message.success(`${name} 缓存命中！`);
  }, []);

  // 缓存未命中回调
  const handleCacheMiss = useCallback((name: string) => {
    setMissCount((prev) => prev + 1);
    message.info(`${name} 缓存未命中`);
  }, []);

  // 清除指定缓存
  const clearCache = useCallback((key?: string) => {
    cacheGroupRef.current?.clearCache(key);
    message.warning(`已清除${key ? ` ${key} ` : "所有"}缓存`);
  }, []);

  // 获取当前缓存信息
  const getCacheInfo = useCallback(() => {
    const keys = cacheGroupRef.current?.getCacheKeys() || [];
    const size = cacheGroupRef.current?.getCacheSize() || 0;
    message.info(`当前缓存数量: ${size}, 缓存键: ${keys.join(", ") || "无"}`);
  }, []);

  // 渲染当前活动的内容
  const renderActiveContent = () => {
    switch (activeTab) {
      case "1":
        return (
          <CacheDom
            cacheKey={`tab1`}
            disabled={cacheDisabled}
            props={[count]}
            onCacheHit={() => handleCacheHit("数据图表分析")}
            onCacheMiss={() => handleCacheMiss("数据图表分析")}
            containerClassName={styles["cache-container"]}
          >
            <ChartComponent title="数据图表分析" count={count} />
          </CacheDom>
        );
      case "2":
        return (
          <CacheDom
            cacheKey={`tab2`}
            disabled={cacheDisabled}
            props={[count]}
            onCacheHit={() => handleCacheHit("项目数据表格")}
            onCacheMiss={() => handleCacheMiss("项目数据表格")}
            containerClassName={styles["cache-container"]}
          >
            <TableComponent title="项目数据表格" count={count} />
          </CacheDom>
        );
      case "3":
        return (
          <CacheDom
            cacheKey={`tab3`}
            disabled={cacheDisabled}
            props={[count]}
            onCacheHit={() => handleCacheHit("用户信息表单")}
            onCacheMiss={() => handleCacheMiss("用户信息表单")}
            containerClassName={styles["cache-container"]}
          >
            <FormComponent title="用户信息表单" count={count} />
          </CacheDom>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles["test-page"]}>
      <div className={styles["content-container"]}>
        <h1>CacheDom 组件演示</h1>
        <p className={styles["page-description"]}>
          通过缓存DOM节点，避免重复渲染耗时组件，提升应用性能和用户体验
        </p>

        <div className={styles["two-column-layout"]}>
          <div className={styles["left-column"]}>
            <div className={styles["custom-tabs"]}>
              <div className={styles["tab-buttons"]}>
                <TabButton
                  active={activeTab === "1"}
                  onClick={() => setActiveTab("1")}
                  icon={<Icon component={ChartIcon} />}
                >
                  图表
                </TabButton>
                <TabButton
                  active={activeTab === "2"}
                  onClick={() => setActiveTab("2")}
                  icon={<Icon component={TableIcon} />}
                >
                  表格
                </TabButton>
                <TabButton
                  active={activeTab === "3"}
                  onClick={() => setActiveTab("3")}
                  icon={<Icon component={FormIcon} />}
                >
                  表单
                </TabButton>
              </div>

              <div className={styles["tab-content"]}>
                <CacheGroup ref={cacheGroupRef} groupId="demo-group" capacity={5}>
                  {renderActiveContent()}
                </CacheGroup>
              </div>
            </div>
          </div>

          <div className={styles["right-column"]}>
            <ControlPanel
              cacheDisabled={cacheDisabled}
              setCacheDisabled={setCacheDisabled}
              count={count}
              setCount={setCount}
              cacheKey={cacheKey}
              setCacheKey={setCacheKey}
              clearCache={clearCache}
              getCacheInfo={getCacheInfo}
              hitCount={hitCount}
              missCount={missCount}
            />

            <div className={styles["instruction-card-container"]}>
              <InstructionCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
