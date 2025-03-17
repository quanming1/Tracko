import React from "react";
import { Button, Card, Switch, Input, Divider, Statistic, Row, Col } from "antd";
import {
  ReloadOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import styles from "../index.module.scss";

interface ControlPanelProps {
  cacheDisabled: boolean;
  setCacheDisabled: (disabled: boolean) => void;
  count: number;
  setCount: (count: number | ((prev: number) => number)) => void;
  cacheKey: string;
  setCacheKey: (key: string) => void;
  clearCache: (key?: string) => void;
  getCacheInfo: () => void;
  hitCount: number;
  missCount: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  cacheDisabled,
  setCacheDisabled,
  count,
  setCount,
  cacheKey,
  setCacheKey,
  clearCache,
  getCacheInfo,
  hitCount,
  missCount,
}) => {
  return (
    <Card className={styles["control-panel-card"]}>
      <div className={styles["panel-header"]}>
        <SettingOutlined className={styles["panel-icon"]} />
        <h3>控制面板</h3>
      </div>

      <Divider />

      <div className={styles["panel-section"]}>
        <h4>缓存控制</h4>
        <div className={styles["control-row"]}>
          <Switch
            checked={!cacheDisabled}
            onChange={(checked) => setCacheDisabled(!checked)}
            checkedChildren="缓存已启用"
            unCheckedChildren="缓存已禁用"
          />
          <span className={styles["control-label"]}>
            {cacheDisabled ? "缓存已禁用" : "缓存已启用"}
          </span>
        </div>
      </div>

      <div className={styles["panel-section"]}>
        <h4>数据控制</h4>
        <div className={styles["control-row"]}>
          <Button type="primary" icon={<ReloadOutlined />} onClick={() => setCount((c) => c + 1)}>
            更新数据 ({count})
          </Button>
        </div>
      </div>

      <div className={styles["panel-section"]}>
        <h4>缓存键设置</h4>
        <div className={styles["control-row"]}>
          <Input
            value={cacheKey}
            onChange={(e) => setCacheKey(e.target.value)}
            placeholder="输入缓存键"
            prefix={<InfoCircleOutlined />}
          />
        </div>
        <div className={styles["control-row"]}>
          <Button icon={<DeleteOutlined />} onClick={() => clearCache(cacheKey)}>
            清除当前缓存
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => clearCache()}>
            清除所有缓存
          </Button>
        </div>
        <div className={styles["control-row"]}>
          <Button type="dashed" icon={<InfoCircleOutlined />} onClick={getCacheInfo}>
            查看缓存信息
          </Button>
        </div>
      </div>

      <Divider />

      <div className={styles["stats-container"]}>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="缓存命中"
              value={hitCount}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="缓存未命中"
              value={missCount}
              valueStyle={{ color: "#ff4d4f" }}
              prefix={<CloseCircleOutlined />}
            />
          </Col>
        </Row>
      </div>
    </Card>
  );
};
