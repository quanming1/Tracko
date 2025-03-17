import React, { useEffect } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import styles from "../index.module.scss";
import { ISafeAny } from "../../../types";

interface ChartComponentProps {
  title: string;
  count: number;
  onRender?: () => void;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({ title, count, onRender }) => {
  // 模拟耗时渲染
  const startTime = performance.now();

  // 生成随机数据
  const generateData = () => {
    const data = [];
    for (let i = 0; i < 7; i++) {
      data.push({
        day: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"][i],
        value: Math.floor(Math.random() * 100) + 20 + count,
      });
    }
    return data;
  };

  const data = generateData();
  const renderTime = performance.now() - startTime;

  // 调用渲染回调
  useEffect(() => {
    onRender?.();
    console.log(`${title} 渲染耗时: ${renderTime.toFixed(2)}ms`);
  }, [title, onRender, renderTime]);

  return (
    <div className={styles["chart-component"]}>
      <div className={styles["component-header"]}>
        <h3>{title}</h3>
        <span className={styles["render-time"]}>
          <ClockCircleOutlined /> 渲染耗时: {renderTime.toFixed(2)}ms
        </span>
      </div>
      <div className={styles["chart-container"]}>
        <div className={styles["chart-y-axis"]}>
          <div>100</div>
          <div>75</div>
          <div>50</div>
          <div>25</div>
          <div>0</div>
        </div>
        <div className={styles["chart-bars"]}>
          {data.map((item, index) => (
            <div key={index} className={styles["chart-bar-item"]}>
              <div
                className={styles["chart-bar"]}
                style={{ height: `${item.value}%` }}
                title={`${item.day}: ${item.value}`}
              />
              <div className={styles["chart-label"]}>{item.day}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles["chart-footer"]}>
        <div className={styles["chart-legend"]}>
          <span className={styles["legend-item"]}>
            <span className={styles["legend-color"]} style={{ backgroundColor: "#1890ff" }} />
            <span>数据集 {count}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
