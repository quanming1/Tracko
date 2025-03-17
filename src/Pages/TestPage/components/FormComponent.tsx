import React, { useState, useEffect } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import styles from "../index.module.scss";

interface FormComponentProps {
  title: string;
  count: number;
  onRender?: () => void;
}

export const FormComponent: React.FC<FormComponentProps> = ({ title, count, onRender }) => {
  // 模拟耗时渲染
  const startTime = performance.now();
  const [formState, setFormState] = useState({
    name: `用户 ${count}`,
    email: `user${count}@example.com`,
    age: 20 + (count % 10),
    address: `城市 ${count}，街道 ${count * 10}`,
  });

  const handleChange = (field: string, value: string | number) => {
    console.log(`${title} 表单状态更新: ${field} = ${value}`);
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderTime = performance.now() - startTime;

  // 调用渲染回调
  useEffect(() => {
    onRender?.();
    console.log(`${title} 渲染耗时: ${renderTime.toFixed(2)}ms`);
  }, [title, onRender, renderTime]);

  useEffect(() => {
    console.log("初始化了");
  }, []);

  return (
    <div className={styles["form-component"]}>
      <div className={styles["component-header"]}>
        <h3>{title}</h3>
        <span className={styles["render-time"]}>
          <ClockCircleOutlined /> 渲染耗时: {renderTime.toFixed(2)}ms
        </span>
      </div>
      <div className={styles["form-container"]}>
        <div className={styles["form-group"]}>
          <label>姓名</label>
          <input
            type="text"
            value={formState.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className={styles["form-group"]}>
          <label>邮箱</label>
          <input
            type="email"
            value={formState.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div className={styles["form-group"]}>
          <label>年龄</label>
          <input
            type="number"
            value={formState.age}
            onChange={(e) => handleChange("age", parseInt(e.target.value))}
          />
        </div>
        <div className={styles["form-group"]}>
          <label>地址</label>
          <textarea
            value={formState.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
        <div className={styles["form-actions"]}>
          <button className={styles["submit-button"]}>提交表单</button>
          <button className={styles["reset-button"]}>重置</button>
        </div>
      </div>
      <div className={styles["form-footer"]}>
        <span>表单版本: {count}.0</span>
      </div>
    </div>
  );
};
