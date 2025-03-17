import React, { useEffect } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import styles from "../index.module.scss";

interface TableComponentProps {
  title: string;
  count: number;
  onRender?: () => void;
}

export const TableComponent: React.FC<TableComponentProps> = ({ title, count, onRender }) => {
  // 模拟耗时渲染
  const startTime = performance.now();

  // 生成随机数据
  const generateData = () => {
    const data = [];
    for (let i = 0; i < 5; i++) {
      data.push({
        id: i + 1,
        name: `项目 ${i + 1}`,
        status: ["进行中", "已完成", "已暂停", "已取消"][Math.floor(Math.random() * 4)],
        progress: Math.floor(Math.random() * 100) + count,
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
    <div className={styles["table-component"]}>
      <div className={styles["component-header"]}>
        <h3>{title}</h3>
        <span className={styles["render-time"]}>
          <ClockCircleOutlined /> 渲染耗时: {renderTime.toFixed(2)}ms
        </span>
      </div>
      <div className={styles["table-container"]}>
        <table className={styles["data-table"]}>
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>状态</th>
              <th>进度</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  <span
                    className={`${styles["status-badge"]} ${
                      item.status === "已完成"
                        ? styles["status-success"]
                        : item.status === "进行中"
                          ? styles["status-processing"]
                          : item.status === "已暂停"
                            ? styles["status-warning"]
                            : styles["status-error"]
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className={styles["progress-bar-container"]}>
                    <div
                      className={styles["progress-bar"]}
                      style={{ width: `${item.progress}%` }}
                    />
                    <span className={styles["progress-text"]}>{item.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles["table-footer"]}>
        <span>共 {data.length} 条数据</span>
        <span>数据集 {count}</span>
      </div>
    </div>
  );
};
