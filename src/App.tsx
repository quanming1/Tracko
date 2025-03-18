import React, { useRef, useState, useEffect } from "react";
import "./Style/index.scss";
import { CacheGroup, CacheGroupRef } from "./components/CacheDom/CacheGroup";
import { CacheDom } from "./components/CacheDom/CacheDom";
import { cache } from "./components/CacheDom/cache"; // 导入 cache 函数
import {
  Button,
  Card,
  Divider,
  Space,
  Switch,
  Input,
  message,
  Tag,
  Typography,
  Tooltip,
  Badge,
  Row,
  Col,
  Alert,
  Radio,
  Form,
  Select,
  DatePicker,
  Checkbox,
} from "antd";
import {
  ReloadOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PlusOutlined,
  SettingOutlined,
  BgColorsOutlined,
  MinusOutlined,
  FormOutlined,
  SaveOutlined,
  ClearOutlined,
  CodeOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Paragraph, Text } = Typography;

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

  // 表单场景状态
  const [isShowForm, setIsShowForm] = useState<boolean>(false);
  const [formReset, setFormReset] = useState<boolean>(false);

  // 新增：直接缓存演示的状态
  const [showDirectCache, setShowDirectCache] = useState<boolean>(false);
  const [directCacheCount, setDirectCacheCount] = useState<number>(0);
  const [directCacheKey, setDirectCacheKey] = useState<string>("direct-cache-demo");
  const [isUpdateAfterUnmount, setIsUpdateAfterUnmount] = useState<boolean>(false);

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
    if (keys.length > 0) {
      message.info(`当前缓存的键: ${keys.join(", ")}`);
    } else {
      message.warning("当前没有缓存的组件");
    }
  };

  // 创建一个使用 cache 函数包装的组件
  // 注意：我们需要在组件内部定义，以便能够访问最新的 directCacheKey
  const DirectCacheComponent = cache(
    ({ title, count }: { title: string; count: number }) => {
      const [internalCount, setInternalCount] = useState<number>(0);
      const mountTime = useRef<string>(new Date().toLocaleTimeString()).current;

      return (
        <Card
          title={
            <Space>
              <Badge status="processing" />
              <span>{title}</span>
              <Tag color="magenta">直接缓存</Tag>
            </Space>
          }
          style={{ width: "100%" }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Alert
              message="这个组件使用 cache 函数直接缓存，而不是通过 CacheDom 组件"
              type="info"
              showIcon
            />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" title="组件信息">
                  <p>
                    <Text type="secondary">挂载时间:</Text> <Tag color="blue">{mountTime}</Tag>
                  </p>
                  <p>
                    <Text type="secondary">外部计数:</Text> <Tag color="green">{count}</Tag>
                  </p>
                  <p>
                    <Text type="secondary">内部计数:</Text>{" "}
                    <Tag color="orange">{internalCount}</Tag>
                  </p>
                  <p>
                    <Text type="secondary">缓存键:</Text> <Tag color="purple">{directCacheKey}</Tag>
                  </p>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="操作">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setInternalCount((prev) => prev + 1)}
                      block
                    >
                      增加内部计数
                    </Button>
                    <Button
                      icon={<SyncOutlined />}
                      onClick={() => {
                        message.info("组件内部状态已保存在缓存中");
                      }}
                      block
                    >
                      检查缓存状态
                    </Button>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Space>
        </Card>
      );
    },
    { cacheKey: directCacheKey },
  );

  return (
    <div className="app-container" style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <Typography.Title level={1} style={{ textAlign: "center", marginBottom: 24 }}>
        <Badge status="processing" /> CacheDom 组件功能演示
      </Typography.Title>

      <Paragraph style={{ textAlign: "center", marginBottom: 32 }}>
        <Text type="secondary">
          CacheDom 是一个用于缓存 React 组件的工具，可以有效提高组件的渲染性能
        </Text>
      </Paragraph>

      <CacheGroup groupId="demo-group" capacity={5} ref={cacheGroupRef}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Card
            title={
              <Space>
                <Badge status="processing" />
                <span>直接缓存函数演示</span>
              </Space>
            }
            bordered
            extra={<Tag color="volcano">高级功能</Tag>}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Alert
                message="这个示例展示了如何直接使用 cache 函数来缓存组件，而不是通过 CacheDom 组件"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16} align="middle">
                <Col>
                  <Tooltip title={showDirectCache ? "点击隐藏组件" : "点击显示组件"}>
                    <Button
                      type="primary"
                      icon={showDirectCache ? <EyeInvisibleOutlined /> : <CodeOutlined />}
                      onClick={() => setShowDirectCache(!showDirectCache)}
                    >
                      {showDirectCache ? "隐藏直接缓存组件" : "显示直接缓存组件"}
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip title="更新传入组件的计数参数">
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => setDirectCacheCount((prev) => prev + 1)}
                    >
                      更新计数: {directCacheCount}
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip title="更改缓存键，将创建新的缓存实例">
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        const newKey = `direct-cache-demo-${Date.now()}`;
                        setDirectCacheKey(newKey);
                        message.success(`已更改缓存键为: ${newKey}`);
                      }}
                    >
                      更改缓存键
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Space align="center">
                    <Text>卸载后更新:</Text>
                    <Tooltip title={isUpdateAfterUnmount ? "卸载后清除缓存" : "卸载后保留缓存"}>
                      <Switch
                        checked={isUpdateAfterUnmount}
                        onChange={setIsUpdateAfterUnmount}
                        checkedChildren="开启"
                        unCheckedChildren="关闭"
                      />
                    </Tooltip>
                  </Space>
                </Col>
              </Row>

              {showDirectCache && (
                <div style={{ marginTop: 16 }}>
                  <DirectCacheComponent
                    title="直接缓存组件示例"
                    count={directCacheCount}
                    containerStyle={{
                      border: "1px dashed #722ed1",
                      padding: 16,
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      background: "#f9f0ff",
                    }}
                    onCacheHit={() => {
                      message.success("直接缓存组件命中缓存");
                    }}
                    onCacheMiss={() => {
                      message.warning("直接缓存组件未命中缓存");
                    }}
                  />
                </div>
              )}

              <Alert
                message="说明：直接缓存函数与 CacheDom 组件的区别"
                description={
                  <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                    <li>直接缓存函数可以更灵活地控制缓存行为</li>
                    <li>可以通过 isUpdateAfterUnmount 参数控制组件卸载后是否清除缓存</li>
                    <li>支持与 CacheDom 相同的回调和样式属性</li>
                    <li>更改缓存键会创建新的缓存实例，而不会影响旧的缓存</li>
                  </ul>
                }
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            </Space>
          </Card>

          <Card
            title={
              <Space>
                <Badge status="processing" />
                <span>表单场景演示</span>
              </Space>
            }
            bordered
            extra={<Tag color="cyan">表单功能</Tag>}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Alert
                message="表单场景下，CacheDom 可以保留用户填写的表单数据，即使表单被隐藏后再次显示"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16} align="middle">
                <Col>
                  <Tooltip title={isShowForm ? "点击隐藏表单" : "点击显示表单"}>
                    <Button
                      type="primary"
                      icon={isShowForm ? <EyeInvisibleOutlined /> : <FormOutlined />}
                      onClick={() => setIsShowForm(!isShowForm)}
                    >
                      {isShowForm ? "隐藏表单" : "显示表单"}
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip title="重置表单数据">
                    <Button
                      icon={<ClearOutlined />}
                      onClick={() => setFormReset(true)}
                      disabled={!isShowForm}
                    >
                      重置表单
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip title="清除表单缓存">
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        cacheGroupRef.current?.clearCache("form-example");
                        message.success("已清除表单缓存");
                      }}
                    >
                      清除表单缓存
                    </Button>
                  </Tooltip>
                </Col>
              </Row>

              {isShowForm && (
                <div style={{ marginTop: 16 }}>
                  <CacheDom
                    cacheKey="form-example"
                    Component={FormExample}
                    props={{
                      reset: formReset,
                      onResetComplete: () => setFormReset(false),
                    }}
                    onCacheHit={() => {
                      message.success("表单数据已从缓存恢复");
                    }}
                    onCacheMiss={() => {
                      message.warning("表单初始化");
                    }}
                    containerClassName="form-container"
                    containerStyle={{
                      border: "1px dashed #13c2c2",
                      padding: 16,
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      background: "#e6fffb",
                    }}
                  />
                </div>
              )}
            </Space>
          </Card>

          <Card
            title={
              <Space>
                <Badge status="success" />
                <span>基本缓存功能演示</span>
              </Space>
            }
            bordered
            extra={<Tag color="blue">基础功能</Tag>}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Alert
                message="组件会在隐藏时被缓存，再次显示时将从缓存中恢复"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16} align="middle">
                <Col>
                  <Tooltip title={isShow1 ? "点击隐藏组件" : "点击显示组件"}>
                    <Button
                      type="primary"
                      icon={isShow1 ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                      onClick={() => setIsShow1(!isShow1)}
                    >
                      {isShow1 ? "隐藏组件1" : "显示组件1"}
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip title="更新传入组件的计数参数">
                    <Button icon={<PlusOutlined />} onClick={() => setCount(count + 1)}>
                      更新计数: {count}
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip title="更新传入组件的名称参数">
                    <Button
                      icon={<SettingOutlined />}
                      onClick={() => setName((prev) => prev + "!")}
                    >
                      更新名称
                    </Button>
                  </Tooltip>
                </Col>
              </Row>

              {isShow1 && (
                <div style={{ marginTop: 16 }}>
                  <CacheDom
                    cacheKey="test-dom-1"
                    Component={TestComponent}
                    props={{ name, count }}
                    onCacheHit={() => {
                      message.success(`组件：${name} 命中缓存`);
                    }}
                    onCacheMiss={() => {
                      message.warning(`组件：${name} 未命中缓存`);
                    }}
                    containerClassName="custom-container"
                    containerStyle={{
                      border: "1px dashed #1890ff",
                      padding: 16,
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      background: "#f0f8ff",
                    }}
                  />
                </div>
              )}
            </Space>
          </Card>

          <Card
            title={
              <Space>
                <Badge status="warning" />
                <span>禁用缓存演示</span>
              </Space>
            }
            bordered
            extra={<Tag color="orange">控制功能</Tag>}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Alert
                message="禁用缓存后，组件每次显示都会重新渲染，不会使用缓存"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16} align="middle">
                <Col>
                  <Tooltip title={isShow2 ? "点击隐藏组件" : "点击显示组件"}>
                    <Button
                      type="primary"
                      icon={isShow2 ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                      onClick={() => setIsShow2(!isShow2)}
                    >
                      {isShow2 ? "隐藏组件2" : "显示组件2"}
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Space align="center">
                    <Text>禁用缓存:</Text>
                    <Tooltip title={disableCache ? "当前已禁用缓存" : "当前已启用缓存"}>
                      <Switch
                        checked={disableCache}
                        onChange={setDisableCache}
                        checkedChildren="已禁用"
                        unCheckedChildren="已启用"
                      />
                    </Tooltip>
                  </Space>
                </Col>
              </Row>

              {isShow2 && (
                <div style={{ marginTop: 16 }}>
                  <CacheDom
                    cacheKey="test-dom-2"
                    Component={TestComponent}
                    props={{ name: "禁用缓存测试", count }}
                    disabled={disableCache}
                    containerStyle={{
                      border: disableCache ? "1px dashed #ff4d4f" : "1px dashed #52c41a",
                      padding: 16,
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      background: disableCache ? "#fff1f0" : "#f6ffed",
                    }}
                  />
                </div>
              )}
            </Space>
          </Card>

          <Card
            title={
              <Space>
                <Badge status="processing" />
                <span>自定义样式演示</span>
              </Space>
            }
            bordered
            extra={<Tag color="purple">样式功能</Tag>}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Alert
                message="可以为缓存组件添加自定义样式，样式变化不会影响组件的缓存状态"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16} align="middle">
                <Col>
                  <Tooltip title={isShow3 ? "点击隐藏组件" : "点击显示组件"}>
                    <Button
                      type="primary"
                      icon={isShow3 ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                      onClick={() => setIsShow3(!isShow3)}
                    >
                      {isShow3 ? "隐藏组件3" : "显示组件3"}
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Space>
                    <Text>
                      <BgColorsOutlined /> 背景颜色:
                    </Text>
                    <Button
                      type={color === "red" ? "primary" : "default"}
                      danger={color === "red"}
                      onClick={() => setColor("red")}
                      style={{
                        background: color === "red" ? "#ff4d4f" : undefined,
                        borderColor: color === "red" ? "#ff4d4f" : undefined,
                      }}
                    >
                      红色
                    </Button>
                    <Button
                      type={color === "green" ? "primary" : "default"}
                      onClick={() => setColor("green")}
                      style={{
                        background: color === "green" ? "#52c41a" : undefined,
                        borderColor: color === "green" ? "#52c41a" : undefined,
                      }}
                    >
                      绿色
                    </Button>
                    <Button
                      type={color === "blue" ? "primary" : "default"}
                      onClick={() => setColor("blue")}
                    >
                      蓝色
                    </Button>
                  </Space>
                </Col>
              </Row>

              {isShow3 && (
                <div style={{ marginTop: 16 }}>
                  <CacheDom
                    cacheKey="test-dom-3"
                    Component={ColorComponent}
                    props={{ color }}
                    containerClassName="styled-container"
                    containerStyle={{
                      padding: 16,
                      borderRadius: 8,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>
              )}
            </Space>
          </Card>

          <Card
            title={
              <Space>
                <Badge status="error" />
                <span>缓存管理</span>
              </Space>
            }
            bordered
            extra={<Tag color="red">管理功能</Tag>}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Alert
                message="可以通过API管理缓存，包括清除特定缓存、清除所有缓存以及查看当前缓存状态"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16}>
                <Col>
                  <Tooltip title="清除组件1的缓存">
                    <Button icon={<DeleteOutlined />} onClick={clearSpecificCache}>
                      清除组件1缓存
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip title="清除所有组件的缓存">
                    <Button danger icon={<DeleteOutlined />} onClick={clearAllCache}>
                      清除所有缓存
                    </Button>
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip title="显示当前缓存的组件键">
                    <Button type="dashed" icon={<InfoCircleOutlined />} onClick={showCacheKeys}>
                      显示当前缓存键
                    </Button>
                  </Tooltip>
                </Col>
              </Row>
            </Space>
          </Card>
        </Space>
      </CacheGroup>

      <Divider style={{ margin: "32px 0" }} />

      <Typography.Paragraph style={{ textAlign: "center" }}>
        <Text type="secondary">CacheDom 组件演示 © {new Date().getFullYear()}</Text>
      </Typography.Paragraph>
    </div>
  );
};

// 测试组件
const TestComponent: React.FC<{ name: string; count: number }> = (props) => {
  const { name, count } = props;
  const [localCount, setLocalCount] = useState<number>(0);
  const mountTime = useRef<string>(new Date().toLocaleTimeString()).current;

  return (
    <div style={{ padding: "8px 0" }}>
      <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 16 }}>
        {name}
        <Tag color="volcano" style={{ marginLeft: 8, verticalAlign: "middle", fontSize: 14 }}>
          组件实例
        </Tag>
      </Typography.Title>

      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <Card size="small" bordered={false} style={{ background: "rgba(0,0,0,0.02)" }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Row align="middle" gutter={8}>
              <Col span={12}>
                <Space>
                  <Badge status="processing" />
                  <Text type="secondary">组件挂载时间:</Text>
                </Space>
              </Col>
              <Col span={12}>
                <Tag color="blue" icon={<InfoCircleOutlined />}>
                  {mountTime}
                </Tag>
              </Col>
            </Row>

            <Row align="middle" gutter={8} style={{ marginTop: 8 }}>
              <Col span={12}>
                <Space>
                  <Badge status="success" />
                  <Text type="secondary">外部计数:</Text>
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <Badge count={count} showZero color="#1890ff" />
                  <Text type="secondary">(由父组件控制)</Text>
                </Space>
              </Col>
            </Row>

            <Row align="middle" gutter={8} style={{ marginTop: 8 }}>
              <Col span={12}>
                <Space>
                  <Badge status="warning" />
                  <Text type="secondary">内部计数:</Text>
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <Badge count={localCount} showZero color="#52c41a" />
                  <Text type="secondary">(组件内部状态)</Text>
                </Space>
              </Col>
            </Row>
          </Space>
        </Card>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setLocalCount((prev) => prev + 1)}
          style={{ marginTop: 8 }}
          block
        >
          增加内部计数
        </Button>

        <Alert
          message="组件内部状态在缓存时会被保留"
          type="info"
          showIcon
          style={{ marginTop: 8 }}
        />
      </Space>
    </div>
  );
};

// 颜色组件
const ColorComponent: React.FC<{ color: string }> = ({ color }) => {
  const [text, setText] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(14);
  const [showBorder, setShowBorder] = useState<boolean>(false);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    opacity: number;
    borderRadius: number;
    padding: number;
    fontWeight: "normal" | "bold";
  }>({
    opacity: 100,
    borderRadius: 8,
    padding: 16,
    fontWeight: "normal",
  });

  // 根据背景色自动计算文本颜色（深色背景用白色文本，浅色背景用黑色文本）
  const getTextColor = (bgColor: string): string => {
    const colorMap: Record<string, string> = {
      red: "white",
      green: "white",
      blue: "white",
    };
    return colorMap[bgColor] || "white";
  };

  const textColor = getTextColor(color);

  // 处理表单数据变化
  const handleFormChange = (key: keyof typeof formData, value: number | string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div
      style={{
        backgroundColor: color || "gray",
        padding: formData.padding,
        color: textColor,
        borderRadius: formData.borderRadius,
        transition: "all 0.3s ease",
        border: showBorder ? `2px solid ${textColor}` : "none",
        opacity: formData.opacity / 100,
      }}
    >
      <Typography.Title level={3} style={{ color: textColor, margin: "0 0 16px 0" }}>
        颜色组件
        <Tag color="white" style={{ color, marginLeft: 8 }}>
          {color}
        </Tag>
        <Button
          type="text"
          size="small"
          icon={<SettingOutlined />}
          onClick={() => setFormVisible(!formVisible)}
          style={{ color: textColor, marginLeft: 8 }}
        />
      </Typography.Title>

      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {formVisible && (
          <Card
            size="small"
            title="样式设置"
            style={{ marginBottom: 16 }}
            extra={
              <Button size="small" type="link" onClick={() => setFormVisible(false)}>
                关闭
              </Button>
            }
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text>不透明度: {formData.opacity}%</Text>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Input
                    type="range"
                    min={20}
                    max={100}
                    value={formData.opacity}
                    onChange={(e) => handleFormChange("opacity", parseInt(e.target.value, 10))}
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <Button size="small" onClick={() => handleFormChange("opacity", 100)}>
                    重置
                  </Button>
                </div>
              </div>

              <div>
                <Text>圆角大小: {formData.borderRadius}px</Text>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() =>
                      handleFormChange("borderRadius", Math.max(0, formData.borderRadius - 2))
                    }
                    style={{ marginRight: 8 }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                      borderRadius: 4,
                    }}
                  >
                    <div
                      style={{
                        width: `${(formData.borderRadius / 20) * 100}%`,
                        height: "100%",
                        backgroundColor: color,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      handleFormChange("borderRadius", Math.min(20, formData.borderRadius + 2))
                    }
                    style={{ marginLeft: 8 }}
                  />
                </div>
              </div>

              <div>
                <Text>内边距: {formData.padding}px</Text>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() => handleFormChange("padding", Math.max(0, formData.padding - 4))}
                    style={{ marginRight: 8 }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: 8,
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                      borderRadius: 4,
                    }}
                  >
                    <div
                      style={{
                        width: `${(formData.padding / 32) * 100}%`,
                        height: "100%",
                        backgroundColor: color,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => handleFormChange("padding", Math.min(32, formData.padding + 4))}
                    style={{ marginLeft: 8 }}
                  />
                </div>
              </div>

              <div>
                <Text>字体粗细:</Text>
                <div style={{ marginTop: 8 }}>
                  <Radio.Group
                    value={formData.fontWeight}
                    onChange={(e) => handleFormChange("fontWeight", e.target.value)}
                    buttonStyle="solid"
                    size="small"
                  >
                    <Radio.Button value="normal">普通</Radio.Button>
                    <Radio.Button value="bold">粗体</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
            </Space>
          </Card>
        )}

        <Input
          placeholder="请输入文本内容"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ marginBottom: 8 }}
          allowClear
          prefix={<EyeOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
        />

        <div style={{ marginBottom: 8 }}>
          <Text
            style={{ color: `rgba(${textColor === "white" ? "255, 255, 255" : "0, 0, 0"}, 0.85)` }}
          >
            字体大小: {fontSize}px
          </Text>
          <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
            <Button
              size="small"
              onClick={() => setFontSize((prev) => Math.max(12, prev - 2))}
              icon={<MinusOutlined />}
              style={{ marginRight: 8 }}
            />
            <div
              style={{
                flex: 1,
                height: 8,
                backgroundColor: `rgba(${textColor === "white" ? "255, 255, 255" : "0, 0, 0"}, 0.2)`,
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  width: `${((fontSize - 12) / 24) * 100}%`,
                  height: "100%",
                  backgroundColor: textColor,
                  borderRadius: 4,
                }}
              />
            </div>
            <Button
              size="small"
              onClick={() => setFontSize((prev) => Math.min(36, prev + 2))}
              icon={<PlusOutlined />}
              style={{ marginLeft: 8 }}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <Text
            style={{
              color: `rgba(${textColor === "white" ? "255, 255, 255" : "0, 0, 0"}, 0.85)`,
              marginRight: 8,
            }}
          >
            显示边框:
          </Text>
          <Switch checked={showBorder} onChange={setShowBorder} size="small" />
        </div>

        {text && (
          <div
            style={{
              padding: 16,
              backgroundColor: `rgba(${textColor === "white" ? "255, 255, 255" : "0, 0, 0"}, 0.1)`,
              borderRadius: 4,
              fontSize: `${fontSize}px`,
              fontWeight: formData.fontWeight,
              transition: "all 0.3s ease",
            }}
          >
            {text}
          </div>
        )}

        {!text && (
          <Alert
            message="请在上方输入框中输入文本"
            type="info"
            showIcon
            style={{
              backgroundColor: `rgba(${textColor === "white" ? "255, 255, 255" : "0, 0, 0"}, 0.1)`,
              borderColor: `rgba(${textColor === "white" ? "255, 255, 255" : "0, 0, 0"}, 0.2)`,
              color: textColor,
            }}
          />
        )}
      </Space>
    </div>
  );
};

// 表单示例组件
const FormExample: React.FC<{
  reset: boolean;
  onResetComplete: () => void;
}> = ({ reset, onResetComplete }) => {
  const [form] = Form.useForm();
  const [submitCount, setSubmitCount] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  // 处理表单重置
  useEffect(() => {
    if (reset) {
      form.resetFields();
      setFormData({});
      onResetComplete();
    }
  }, [reset, form, onResetComplete]);

  // 表单提交处理
  const handleSubmit = (values: Record<string, unknown>) => {
    setFormData(values);
    setSubmitCount((prev) => prev + 1);
    message.success("表单提交成功！数据已保存在组件状态中");
  };

  return (
    <div>
      <Typography.Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>
        用户信息表单
        <Tag color="cyan" style={{ marginLeft: 8, verticalAlign: "middle", fontSize: 14 }}>
          已提交 {submitCount} 次
        </Tag>
      </Typography.Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          gender: "male",
          notifications: ["email"],
          agreement: true,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: "请输入姓名" }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: "请输入邮箱" },
                { type: "email", message: "请输入有效的邮箱地址" },
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="手机号码"
              rules={[{ required: true, message: "请输入手机号码" }]}
            >
              <Input placeholder="请输入手机号码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="gender" label="性别">
              <Select placeholder="请选择性别">
                <Select.Option value="male">男</Select.Option>
                <Select.Option value="female">女</Select.Option>
                <Select.Option value="other">其他</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="birthday" label="出生日期">
          <DatePicker style={{ width: "100%" }} placeholder="请选择出生日期" />
        </Form.Item>

        <Form.Item name="address" label="地址">
          <Input.TextArea rows={2} placeholder="请输入地址" />
        </Form.Item>

        <Form.Item name="notifications" label="通知方式">
          <Checkbox.Group>
            <Checkbox value="email">邮件</Checkbox>
            <Checkbox value="sms">短信</Checkbox>
            <Checkbox value="phone">电话</Checkbox>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error("请同意用户协议")),
            },
          ]}
        >
          <Checkbox>
            我已阅读并同意<a href="#agreement">用户协议</a>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              提交表单
            </Button>
            <Button htmlType="button" onClick={() => form.resetFields()} icon={<ClearOutlined />}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {Object.keys(formData).length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Alert
            message="最近一次提交的表单数据"
            description={
              <pre
                style={{
                  maxHeight: "200px",
                  overflow: "auto",
                  background: "rgba(0,0,0,0.03)",
                  padding: 8,
                  borderRadius: 4,
                }}
              >
                {JSON.stringify(formData, null, 2)}
              </pre>
            }
            type="success"
            showIcon
          />
        </div>
      )}
    </div>
  );
};

export default App;
