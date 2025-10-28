import React, { useState, useEffect, useRef } from "react";

interface OperationBoxProps {
  title: string;
  operations: string[];
  nested?: React.ReactNode;
}

export const OperationBox: React.FC<OperationBoxProps> = ({ title, operations, nested }) => {
  const [flashIndex, setFlashIndex] = useState<number>(-1);

  useEffect(() => {
    // 随机触发闪烁效果
    const interval = setInterval(
      () => {
        const randomIndex = Math.floor(Math.random() * operations.length);
        setFlashIndex(randomIndex);
        setTimeout(() => setFlashIndex(-1), 200);
      },
      Math.random() * 2000 + 500,
    );

    return () => clearInterval(interval);
  }, [operations.length]);

  return (
    <div style={boxStyle}>
      <div style={titleStyle}>{title}</div>
      {operations.map((op, idx) => (
        <div
          key={idx}
          style={{
            ...opItemStyle,
            ...(flashIndex === idx ? flashStyle : {}),
          }}
        >
          {op}
        </div>
      ))}
      {nested && <div style={nestedContainerStyle}>{nested}</div>}
    </div>
  );
};

interface MemoryTestLayoutProps {
  title: string;
  chartRef: React.RefObject<HTMLDivElement>;
  status: string;
  currentMemory: number;
  dataStats: {
    total: number;
    users: number;
    products: number;
  };
}

export const MemoryTestLayout: React.FC<MemoryTestLayoutProps> = ({
  title,
  chartRef,
  status,
  currentMemory,
  dataStats,
}) => {
  return (
    <div style={containerStyle}>
      {/* 左侧操作面板 */}
      <div style={leftPanelStyle}>
        <div style={panelTitleStyle}>组件操作监控 (50+组件)</div>

        {/* 用户管理模块 */}
        <OperationBox
          title="UserManager"
          operations={["查询用户", "创建用户"]}
          nested={
            <>
              <OperationBox
                title="UserProfile"
                operations={["读取信息", "更新年龄", "修改邮箱"]}
                nested={
                  <>
                    <OperationBox title="ProfileValidator" operations={["验证邮箱", "验证年龄"]} />
                    <OperationBox title="ProfileCache" operations={["缓存读取", "缓存更新"]} />
                  </>
                }
              />
              <OperationBox
                title="UserPosts"
                operations={["获取文章", "发布文章"]}
                nested={
                  <>
                    <OperationBox title="PostEditor" operations={["编辑标题", "编辑内容"]} />
                    <OperationBox title="PostTags" operations={["添加标签", "删除标签"]} />
                    <OperationBox title="PostComments" operations={["添加评论", "删除评论"]} />
                  </>
                }
              />
              <OperationBox
                title="UserSettings"
                operations={["修改主题", "通知设置"]}
                nested={
                  <OperationBox title="SettingsValidator" operations={["验证配置", "保存配置"]} />
                }
              />
              <OperationBox title="UserNotifications" operations={["读取通知", "标记已读"]} />
              <OperationBox title="UserFriends" operations={["获取好友", "添加好友", "删除好友"]} />
            </>
          }
        />

        {/* 产品管理模块 */}
        <OperationBox
          title="ProductManager"
          operations={["查询产品", "创建产品"]}
          nested={
            <>
              <OperationBox
                title="ProductDetail"
                operations={["读取详情", "更新价格"]}
                nested={
                  <>
                    <OperationBox title="PriceCalculator" operations={["计算折扣", "计算税费"]} />
                    <OperationBox title="ProductImages" operations={["上传图片", "删除图片"]} />
                  </>
                }
              />
              <OperationBox
                title="InventoryManager"
                operations={["查询库存", "更新库存"]}
                nested={
                  <>
                    <OperationBox
                      title="StockControl"
                      operations={["增加库存", "减少库存"]}
                      nested={
                        <OperationBox title="StockAlert" operations={["检查预警", "发送通知"]} />
                      }
                    />
                    <OperationBox
                      title="WarehouseManager"
                      operations={["查询仓库", "分配仓库"]}
                      nested={
                        <>
                          <OperationBox title="WarehouseA" operations={["入库", "出库", "盘点"]} />
                          <OperationBox title="WarehouseB" operations={["入库", "出库", "盘点"]} />
                          <OperationBox title="WarehouseC" operations={["入库", "出库", "盘点"]} />
                        </>
                      }
                    />
                  </>
                }
              />
              <OperationBox title="ProductCategories" operations={["读取分类", "更新分类"]} />
              <OperationBox title="ProductReviews" operations={["获取评价", "添加评价"]} />
            </>
          }
        />

        {/* 订单管理模块 */}
        <OperationBox
          title="OrderManager"
          operations={["查询订单", "创建订单"]}
          nested={
            <>
              <OperationBox
                title="OrderList"
                operations={["分页查询", "过滤订单"]}
                nested={
                  <OperationBox title="OrderFilter" operations={["按状态", "按日期", "按用户"]} />
                }
              />
              <OperationBox
                title="OrderDetail"
                operations={["读取详情", "更新状态"]}
                nested={
                  <>
                    <OperationBox title="OrderItems" operations={["读取商品", "修改数量"]} />
                    <OperationBox title="OrderCalculator" operations={["计算总价", "计算运费"]} />
                  </>
                }
              />
              <OperationBox title="OrderPayment" operations={["发起支付", "确认支付", "退款"]} />
              <OperationBox title="OrderShipping" operations={["创建物流", "更新物流"]} />
            </>
          }
        />

        {/* 购物车模块 */}
        <OperationBox
          title="CartManager"
          operations={["读取购物车", "清空购物车"]}
          nested={
            <>
              <OperationBox title="CartItems" operations={["添加商品", "删除商品", "修改数量"]} />
              <OperationBox title="CartCalculator" operations={["计算小计", "计算总价"]} />
              <OperationBox title="CartDiscount" operations={["应用优惠券", "计算折扣"]} />
            </>
          }
        />

        {/* 权限认证模块 */}
        <OperationBox
          title="AuthManager"
          operations={["验证登录", "刷新Token"]}
          nested={
            <>
              <OperationBox title="LoginService" operations={["用户登录", "记住密码"]} />
              <OperationBox title="LogoutService" operations={["退出登录", "清除缓存"]} />
              <OperationBox title="RegisterService" operations={["注册用户", "发送验证码"]} />
              <OperationBox title="PermissionCheck" operations={["检查权限", "验证角色"]} />
            </>
          }
        />

        {/* 通知系统模块 */}
        <OperationBox
          title="NotificationSystem"
          operations={["发送通知", "批量发送"]}
          nested={
            <>
              <OperationBox title="EmailService" operations={["发送邮件", "验证邮箱"]} />
              <OperationBox title="SMSService" operations={["发送短信", "验证手机"]} />
              <OperationBox title="PushService" operations={["推送消息", "订阅主题"]} />
            </>
          }
        />

        {/* 数据分析模块 */}
        <OperationBox
          title="AnalyticsManager"
          operations={["生成报表", "导出数据"]}
          nested={
            <>
              <OperationBox title="UserAnalytics" operations={["活跃用户", "新增用户"]} />
              <OperationBox title="ProductAnalytics" operations={["热门产品", "库存统计"]} />
              <OperationBox title="OrderAnalytics" operations={["订单统计", "销售额统计"]} />
            </>
          }
        />

        {/* 搜索系统模块 */}
        <OperationBox
          title="SearchManager"
          operations={["全文搜索", "重建索引"]}
          nested={
            <>
              <OperationBox title="SearchIndex" operations={["创建索引", "更新索引"]} />
              <OperationBox title="SearchFilter" operations={["过滤结果", "高级筛选"]} />
              <OperationBox title="SearchSort" operations={["相关性排序", "时间排序"]} />
            </>
          }
        />

        {/* 缓存系统模块 */}
        <OperationBox
          title="CacheManager"
          operations={["查询缓存", "批量清除"]}
          nested={
            <>
              <OperationBox title="CacheRead" operations={["读取缓存", "检查过期"]} />
              <OperationBox title="CacheWrite" operations={["写入缓存", "设置过期"]} />
              <OperationBox title="CacheInvalidate" operations={["失效缓存", "清空缓存"]} />
            </>
          }
        />

        {/* 日志系统模块 */}
        <OperationBox
          title="LogManager"
          operations={["写入日志", "查询日志"]}
          nested={
            <>
              <OperationBox title="ErrorLog" operations={["记录错误", "异常追踪"]} />
              <OperationBox title="AccessLog" operations={["记录访问", "统计PV"]} />
              <OperationBox title="ActionLog" operations={["记录操作", "审计追踪"]} />
            </>
          }
        />

        {/* 批量操作模块 */}
        <OperationBox
          title="BatchOperations"
          operations={["批量导入", "批量导出"]}
          nested={
            <>
              <OperationBox title="BatchUsers" operations={["批量创建", "批量更新", "批量删除"]} />
              <OperationBox
                title="BatchProducts"
                operations={["批量上架", "批量下架", "批量调价"]}
              />
            </>
          }
        />
      </div>

      {/* 右侧图表面板 */}
      <div style={rightPanelStyle}>
        <div style={headerStyle}>
          <div style={chartTitleStyle}>{title}</div>
          <div style={statusStyle}>
            状态: {status} | 内存: {currentMemory.toFixed(2)} MB
          </div>
          <div style={statsStyle}>
            总量: {dataStats.total} | users: {dataStats.users} | products: {dataStats.products}
          </div>
        </div>
        <div ref={chartRef} style={chartStyle}></div>
      </div>
    </div>
  );
};

// 样式
const containerStyle: React.CSSProperties = {
  display: "flex",
  height: "100vh",
  fontFamily: "monospace",
  fontSize: "10px",
  background: "#fafafa",
};

const leftPanelStyle: React.CSSProperties = {
  width: "320px",
  padding: "8px",
  overflowY: "auto",
  borderRight: "1px solid #ddd",
  background: "#fff",
};

const panelTitleStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "600",
  marginBottom: "8px",
  paddingBottom: "6px",
  borderBottom: "1px solid #ddd",
};

const rightPanelStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: "8px",
};

const headerStyle: React.CSSProperties = {
  marginBottom: "8px",
  paddingBottom: "6px",
  borderBottom: "1px solid #ddd",
};

const chartTitleStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "600",
  marginBottom: "4px",
};

const statusStyle: React.CSSProperties = {
  fontSize: "10px",
  marginBottom: "2px",
};

const statsStyle: React.CSSProperties = {
  fontSize: "9px",
  color: "#666",
};

const chartStyle: React.CSSProperties = {
  flex: 1,
  minHeight: "300px",
};

const boxStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "6px",
  marginBottom: "6px",
  background: "#fff",
  borderRadius: "2px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: "600",
  marginBottom: "4px",
  color: "#333",
  borderBottom: "1px solid #eee",
  paddingBottom: "2px",
};

const opItemStyle: React.CSSProperties = {
  fontSize: "9px",
  padding: "2px 4px",
  marginBottom: "1px",
  color: "#666",
  lineHeight: "1.4",
  transition: "all 0.2s",
};

const flashStyle: React.CSSProperties = {
  background: "#333",
  color: "#fff",
  fontWeight: "600",
};

const nestedContainerStyle: React.CSSProperties = {
  marginTop: "4px",
  marginLeft: "8px",
  paddingLeft: "8px",
  borderLeft: "2px solid #eee",
};
