import React, { useState, useEffect, useRef } from "react";

interface OperationBoxProps {
  title: string;
  operations: Array<{
    name: string;
    action: () => void;
  }>;
  nested?: React.ReactNode;
}

export const OperationBox: React.FC<OperationBoxProps> = ({ title, operations, nested }) => {
  const [flashIndex, setFlashIndex] = useState<number>(-1);
  const operationsRef = useRef(operations);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 保持最新的 operations 引用
  useEffect(() => {
    operationsRef.current = operations;
  }, [operations]);

  useEffect(() => {
    // 定时执行操作
    const executeOperation = () => {
      const ops = operationsRef.current;
      const randomIndex = Math.floor(Math.random() * ops.length);
      // 执行实际操作
      try {
        ops[randomIndex].action();
      } catch (error) {
        console.error("操作执行失败:", error);
      }
      // 操作后闪烁
      setFlashIndex(randomIndex);
      setTimeout(() => setFlashIndex(-1), 200);

      // 随机下次执行时间
      const nextDelay = Math.random() * 1000 + 300;
      timeoutRef.current = setTimeout(executeOperation, nextDelay);
    };

    // 首次执行
    const firstDelay = Math.random() * 1000 + 300;
    timeoutRef.current = setTimeout(executeOperation, firstDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // 空依赖，只在组件挂载时执行一次

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
          {op.name}
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
  store: any;
}

export const MemoryTestLayout: React.FC<MemoryTestLayoutProps> = ({
  title,
  chartRef,
  status,
  currentMemory,
  dataStats,
  store,
}) => {
  return (
    <div style={containerStyle}>
      {/* 左侧操作面板 */}
      <div style={leftPanelStyle}>
        <div style={panelTitleStyle}>组件操作监控 (10+组件)</div>

        {/* 用户管理模块 */}
        <OperationBox
          title="UserManager"
          operations={[
            {
              name: "修改年龄",
              action: () => {
                if (store.users && store.users.length > 0) {
                  const idx = Math.floor(Math.random() * store.users.length);
                  store.users[idx].profile.age++;
                }
              },
            },
            {
              name: "更新邮箱",
              action: () => {
                if (store.users && store.users.length > 0) {
                  const idx = Math.floor(Math.random() * store.users.length);
                  store.users[idx].profile.email = `updated${Date.now()}@test.com`;
                }
              },
            },
          ]}
          nested={
            <>
              <OperationBox
                title="UserPosts"
                operations={[
                  {
                    name: "添加文章",
                    action: () => {
                      if (store.users && store.users.length > 0) {
                        const idx = Math.floor(Math.random() * store.users.length);
                        store.users[idx].posts.push({
                          id: Date.now(),
                          uuid: `post-${Date.now()}`,
                          title: `New Post`,
                          content: "New content " + Date.now(),
                          summary: "Summary",
                          coverImage: "",
                          tags: ["new"],
                          metadata: { views: 0, likes: 0, comments: 0, shares: 0 },
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        });
                      }
                    },
                  },
                  {
                    name: "删除文章",
                    action: () => {
                      if (store.users && store.users.length > 0) {
                        const idx = Math.floor(Math.random() * store.users.length);
                        if (store.users[idx].posts.length > 0) {
                          store.users[idx].posts.pop();
                        }
                      }
                    },
                  },
                ]}
              />
              <OperationBox
                title="UserSettings"
                operations={[
                  {
                    name: "切换主题",
                    action: () => {
                      if (store.users && store.users.length > 0) {
                        const idx = Math.floor(Math.random() * store.users.length);
                        store.users[idx].profile.settings.theme =
                          store.users[idx].profile.settings.theme === "dark" ? "light" : "dark";
                      }
                    },
                  },
                  {
                    name: "通知开关",
                    action: () => {
                      if (store.users && store.users.length > 0) {
                        const idx = Math.floor(Math.random() * store.users.length);
                        store.users[idx].profile.settings.notifications =
                          !store.users[idx].profile.settings.notifications;
                      }
                    },
                  },
                ]}
              />
            </>
          }
        />

        {/* 产品管理模块 */}
        <OperationBox
          title="ProductManager"
          operations={[
            {
              name: "更新价格",
              action: () => {
                if (store.products && store.products.length > 0) {
                  const idx = Math.floor(Math.random() * store.products.length);
                  store.products[idx].price = Math.random() * 1000;
                }
              },
            },
            {
              name: "修改折扣",
              action: () => {
                if (store.products && store.products.length > 0) {
                  const idx = Math.floor(Math.random() * store.products.length);
                  store.products[idx].discount = Math.floor(Math.random() * 50);
                }
              },
            },
          ]}
          nested={
            <OperationBox
              title="InventoryManager"
              operations={[
                {
                  name: "增加库存",
                  action: () => {
                    if (store.products && store.products.length > 0) {
                      const idx = Math.floor(Math.random() * store.products.length);
                      store.products[idx].inventory.stock += 10;
                    }
                  },
                },
                {
                  name: "减少库存",
                  action: () => {
                    if (store.products && store.products.length > 0) {
                      const idx = Math.floor(Math.random() * store.products.length);
                      if (store.products[idx].inventory.stock > 0) {
                        store.products[idx].inventory.stock -= 1;
                      }
                    }
                  },
                },
              ]}
              nested={
                <OperationBox
                  title="WarehouseManager"
                  operations={[
                    {
                      name: "仓库入库",
                      action: () => {
                        if (store.products && store.products.length > 0) {
                          const idx = Math.floor(Math.random() * store.products.length);
                          if (store.products[idx].inventory.warehouses.length > 0) {
                            const wIdx = Math.floor(
                              Math.random() * store.products[idx].inventory.warehouses.length,
                            );
                            store.products[idx].inventory.warehouses[wIdx].quantity += 5;
                          }
                        }
                      },
                    },
                    {
                      name: "仓库出库",
                      action: () => {
                        if (store.products && store.products.length > 0) {
                          const idx = Math.floor(Math.random() * store.products.length);
                          if (store.products[idx].inventory.warehouses.length > 0) {
                            const wIdx = Math.floor(
                              Math.random() * store.products[idx].inventory.warehouses.length,
                            );
                            if (store.products[idx].inventory.warehouses[wIdx].quantity > 0) {
                              store.products[idx].inventory.warehouses[wIdx].quantity -= 1;
                            }
                          }
                        }
                      },
                    },
                  ]}
                />
              }
            />
          }
        />

        {/* 批量操作模块 */}
        <OperationBox
          title="BatchOperations"
          operations={[
            {
              name: "批量添加用户",
              action: () => {
                if (store.users && store.users.length < 5500) {
                  const longText = "Lorem ipsum dolor sit amet ".repeat(20);
                  store.users.push({
                    id: Date.now(),
                    uuid: `uuid-${Date.now()}`,
                    name: "BatchUser",
                    username: `batch_${Date.now()}`,
                    firstName: "Batch",
                    lastName: "User",
                    displayName: "BatchUser",
                    bio: longText,
                    description: longText,
                    profile: {
                      age: 25,
                      email: "batch@test.com",
                      phone: "+86-13800000000",
                      avatar: "",
                      coverImage: "",
                      address: {
                        country: "China",
                        province: "Province",
                        city: "City",
                        district: "District",
                        street: "Street",
                        zipCode: "100000",
                      },
                      settings: {
                        theme: "dark",
                        language: "zh-CN",
                        timezone: "Asia/Shanghai",
                        notifications: true,
                        emailNotifications: true,
                        pushNotifications: true,
                        privacy: { showEmail: false, showPhone: false, allowSearch: true },
                      },
                      socialLinks: { github: "", twitter: "", linkedin: "" },
                    },
                    stats: {
                      followers: 0,
                      following: 0,
                      postsCount: 0,
                      likesReceived: 0,
                      commentsReceived: 0,
                    },
                    posts: [],
                    metadata: {
                      createdAt: new Date().toISOString(),
                      lastLoginAt: new Date().toISOString(),
                      isActive: true,
                      isVerified: false,
                      isPremium: false,
                      role: "user",
                    },
                  });
                }
              },
            },
            {
              name: "批量删除用户",
              action: () => {
                if (store.users && store.users.length > 5000) {
                  store.users.pop();
                }
              },
            },
            {
              name: "批量添加产品",
              action: () => {
                if (store.products && store.products.length < 2700) {
                  const longDesc = "Product description ".repeat(30);
                  store.products.push({
                    id: Date.now(),
                    sku: `SKU-${Date.now()}`,
                    barcode: `${Date.now()}`,
                    name: "BatchProduct",
                    fullName: "Batch Product",
                    brand: "BatchBrand",
                    category: "Category",
                    subCategory: "SubCategory",
                    description: longDesc,
                    specifications: longDesc,
                    price: 100,
                    originalPrice: 120,
                    discount: 10,
                    currency: "CNY",
                    images: [],
                    inventory: {
                      stock: 10,
                      reserved: 0,
                      available: 10,
                      minStock: 10,
                      maxStock: 100,
                      warehouses: [],
                    },
                    shipping: {
                      weight: 1,
                      length: 10,
                      width: 10,
                      height: 10,
                      shippingCost: 10,
                      freeShippingThreshold: 99,
                    },
                    ratings: {
                      average: 0,
                      count: 0,
                      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                    },
                    metadata: {
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      isActive: true,
                      isFeatured: false,
                      isNew: true,
                      tags: [],
                    },
                  });
                }
              },
            },
            {
              name: "批量删除产品",
              action: () => {
                if (store.products && store.products.length > 2500) {
                  store.products.pop();
                }
              },
            },
          ]}
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
