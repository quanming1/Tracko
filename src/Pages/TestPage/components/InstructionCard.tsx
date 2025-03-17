import React from "react";
import { Card, Divider } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import styles from "../index.module.scss";

export const InstructionCard: React.FC = () => {
  return (
    <Card className={styles["instruction-card"]}>
      <div className={styles["panel-header"]}>
        <InfoCircleOutlined className={styles["panel-icon"]} />
        <h3>使用说明</h3>
      </div>

      <Divider />

      <div className={styles["instruction-content"]}>
        <p>
          <strong>CacheDom 组件</strong>
          用于缓存DOM节点，避免在切换内容时重复渲染耗时组件。
        </p>

        <h4>主要功能演示：</h4>
        <ul>
          <li>
            <span className={styles["highlight"]}>内容切换：</span>
            在不同内容区域之间切换，观察缓存命中和未命中次数
          </li>
          <li>
            <span className={styles["highlight"]}>更新数据：</span>
            使用"更新数据"按钮触发依赖更新，强制重新渲染缓存内容
          </li>
          <li>
            <span className={styles["highlight"]}>缓存控制：</span>
            使用"清除缓存"按钮清除指定或所有缓存
          </li>
          <li>
            <span className={styles["highlight"]}>缓存开关：</span>
            切换缓存启用/禁用状态，观察渲染行为变化
          </li>
          <li>
            <span className={styles["highlight"]}>状态保持：</span>
            修改表单或其他组件状态，观察状态是否被正确缓存
          </li>
        </ul>
      </div>
    </Card>
  );
};
