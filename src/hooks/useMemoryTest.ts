import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

interface MemoryTestConfig {
  title: string;
  store: any;
  getArrayLength: () => number;
  durationMinutes?: number;
}

export const useMemoryTest = ({
  title,
  store,
  getArrayLength,
  durationMinutes = 30,
}: MemoryTestConfig) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [status, setStatus] = useState("准备中...");
  const [currentMemory, setCurrentMemory] = useState(0);
  const [arrayLength, setArrayLength] = useState(0);
  const memoryDataRef = useRef<{ time: number; memory: number }[]>([]);
  const testRunningRef = useRef(false);

  const getMemoryUsage = (): number => {
    if ((performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // 转换为 MB
    }
    return 0;
  };

  const updateChart = () => {
    const memory = getMemoryUsage();
    const time = memoryDataRef.current.length;
    memoryDataRef.current.push({ time, memory });
    setCurrentMemory(memory);
    setArrayLength(getArrayLength());

    if (chartInstanceRef.current) {
      chartInstanceRef.current.setOption({
        xAxis: {
          data: memoryDataRef.current.map((d) => d.time),
        },
        series: [
          {
            data: memoryDataRef.current.map((d) => d.memory.toFixed(2)),
          },
        ],
      });
    }
  };

  const startTest = async () => {
    if (testRunningRef.current) {
      console.log("测试已经在运行中");
      return;
    }
    testRunningRef.current = true;

    console.log("开始初始化测试...");
    setStatus("测试进行中...");

    // 生成长文本内容
    const generateLongText = (length: number): string => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    // 初始化复杂嵌套数据结构 - 5000个用户
    store.users = Array.from({ length: 5000 }, (_, i) => ({
      id: i,
      uuid: `uuid-${i}-${Date.now()}-${Math.random()}`,
      name: `User${i}`,
      username: `user_${i}_${Math.random().toString(36).substring(7)}`,
      firstName: `FirstName${i}`,
      lastName: `LastName${i}`,
      displayName: `Display${i}`,
      bio: generateLongText(500), // 500字符的个人简介
      description: generateLongText(800), // 800字符的详细描述
      profile: {
        age: 20 + (i % 50),
        email: `user${i}@test.com`,
        phone: `+86-138${String(i).padStart(8, "0")}`,
        avatar: `https://avatar.example.com/user${i}.jpg`,
        coverImage: `https://cover.example.com/user${i}.jpg`,
        address: {
          country: "China",
          province: `Province${i % 34}`,
          city: `City${i % 100}`,
          district: `District${i % 50}`,
          street: `Street${i % 200}`,
          zipCode: `${100000 + i}`,
        },
        settings: {
          theme: i % 2 === 0 ? "dark" : "light",
          language: i % 3 === 0 ? "zh-CN" : i % 3 === 1 ? "en-US" : "ja-JP",
          timezone: "Asia/Shanghai",
          notifications: true,
          emailNotifications: i % 2 === 0,
          pushNotifications: i % 3 === 0,
          privacy: {
            showEmail: i % 2 === 0,
            showPhone: i % 3 === 0,
            allowSearch: true,
          },
        },
        socialLinks: {
          github: `https://github.com/user${i}`,
          twitter: `https://twitter.com/user${i}`,
          linkedin: `https://linkedin.com/in/user${i}`,
        },
      },
      stats: {
        followers: Math.floor(Math.random() * 10000),
        following: Math.floor(Math.random() * 1000),
        postsCount: Math.floor(Math.random() * 500),
        likesReceived: Math.floor(Math.random() * 50000),
        commentsReceived: Math.floor(Math.random() * 5000),
      },
      posts: Array.from({ length: 10 }, (_, j) => ({
        id: j,
        uuid: `post-${i}-${j}-${Date.now()}`,
        title: `Post${j} by User${i}`,
        content: generateLongText(1000), // 1000字符的文章内容
        summary: generateLongText(200), // 200字符的摘要
        coverImage: `https://post.example.com/cover${i}_${j}.jpg`,
        tags: [`tag${j % 5}`, `tag${(j + 1) % 5}`, `category${i % 10}`],
        metadata: {
          views: Math.floor(Math.random() * 10000),
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50),
        },
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      metadata: {
        createdAt: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString(),
        lastLoginAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: i % 10 !== 0,
        isVerified: i % 5 !== 0,
        isPremium: i % 20 === 0,
        role: i % 100 === 0 ? "admin" : i % 10 === 0 ? "moderator" : "user",
      },
    }));

    // 初始化产品数据 - 2500个产品
    store.products = Array.from({ length: 2500 }, (_, i) => ({
      id: i,
      sku: `SKU-${String(i).padStart(8, "0")}`,
      barcode: `${7890000000000 + i}`,
      name: `Product${i}`,
      fullName: `Full Product Name ${i} with Description`,
      brand: `Brand${i % 50}`,
      category: `Category${i % 100}`,
      subCategory: `SubCategory${i % 200}`,
      description: generateLongText(1200), // 1200字符的产品描述
      specifications: generateLongText(800), // 800字符的规格说明
      price: Math.random() * 1000,
      originalPrice: Math.random() * 1200,
      discount: Math.floor(Math.random() * 50),
      currency: "CNY",
      images: Array.from({ length: 5 }, (_, img) => `https://product.example.com/${i}_${img}.jpg`),
      inventory: {
        stock: Math.floor(Math.random() * 100),
        reserved: Math.floor(Math.random() * 20),
        available: Math.floor(Math.random() * 80),
        minStock: 10,
        maxStock: 500,
        warehouses: Array.from({ length: 3 }, (_, w) => ({
          id: w,
          warehouseCode: `WH-${String(w).padStart(4, "0")}`,
          location: `Warehouse${w}`,
          address: `Address of Warehouse ${w}, City ${i % 50}`,
          quantity: Math.floor(Math.random() * 50),
          reserved: Math.floor(Math.random() * 10),
          available: Math.floor(Math.random() * 40),
          manager: `Manager${w}`,
          phone: `+86-138${String(w).padStart(8, "0")}`,
        })),
      },
      shipping: {
        weight: Math.random() * 10,
        length: Math.random() * 100,
        width: Math.random() * 100,
        height: Math.random() * 100,
        shippingCost: Math.random() * 50,
        freeShippingThreshold: 99,
      },
      ratings: {
        average: Math.random() * 5,
        count: Math.floor(Math.random() * 1000),
        distribution: {
          5: Math.floor(Math.random() * 500),
          4: Math.floor(Math.random() * 300),
          3: Math.floor(Math.random() * 150),
          2: Math.floor(Math.random() * 50),
          1: Math.floor(Math.random() * 20),
        },
      },
      metadata: {
        createdAt: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: i % 10 !== 0,
        isFeatured: i % 20 === 0,
        isNew: i % 50 === 0,
        tags: [`tag${i % 10}`, `feature${i % 20}`, `style${i % 15}`],
      },
    }));

    console.log("初始化数据完成");
    console.log("users:", store.users?.length || 0);
    console.log("products:", store.products?.length || 0);
    updateChart();

    // 启动定时器记录内存
    const memoryInterval = setInterval(updateChart, 1000);

    // 计算总循环次数：durationMinutes分钟 * 60秒 * 10次/秒 = 总次数
    const totalIterations = durationMinutes * 60 * 10;
    console.log(`开始测试循环，总计 ${totalIterations} 次，预计耗时${durationMinutes}分钟...`);

    for (let i = 0; i < totalIterations; i++) {
      // 复杂的CRUD操作
      // 1. 用户操作
      if (store.users && store.users.length > 0) {
        const userIdx = Math.floor(Math.random() * store.users.length);
        // 修改用户属性
        store.users[userIdx].profile.age++;
        // 添加/删除文章
        if (Math.random() > 0.5) {
          store.users[userIdx].posts.push({
            id: Date.now(),
            title: "New Post",
            content: "New Content",
            tags: ["new"],
          });
        } else if (store.users[userIdx].posts.length > 0) {
          store.users[userIdx].posts.pop();
        }
      }

      // 2. 产品操作
      if (store.products && store.products.length > 0) {
        const productIdx = Math.floor(Math.random() * store.products.length);
        // 修改库存
        store.products[productIdx].inventory.stock = Math.floor(Math.random() * 100);
        // 修改仓库数据
        if (store.products[productIdx].inventory.warehouses.length > 0) {
          const warehouseIdx = Math.floor(
            Math.random() * store.products[productIdx].inventory.warehouses.length,
          );
          store.products[productIdx].inventory.warehouses[warehouseIdx].quantity++;
        }
      }

      // 3. 添加/删除用户
      if (i % 50 === 0) {
        if (store.users && Math.random() > 0.5) {
          const newUserId = Date.now();
          const longText = "Lorem ipsum dolor sit amet ".repeat(20); // 生成长文本
          store.users.push({
            id: newUserId,
            uuid: `uuid-${newUserId}`,
            name: "NewUser",
            username: `new_user_${newUserId}`,
            firstName: "New",
            lastName: "User",
            displayName: "NewUser",
            bio: longText,
            description: longText + longText,
            profile: {
              age: 25,
              email: "new@test.com",
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
        } else if (store.users && store.users.length > 5000) {
          store.users.pop();
        }
      }

      // 4. 添加/删除产品
      if (i % 100 === 0) {
        if (store.products && Math.random() > 0.5) {
          const newProductId = Date.now();
          const longDesc = "Product description with many details ".repeat(30);
          store.products.push({
            id: newProductId,
            sku: `SKU-${newProductId}`,
            barcode: `${newProductId}`,
            name: "NewProduct",
            fullName: "New Product Full Name",
            brand: "NewBrand",
            category: "NewCategory",
            subCategory: "NewSubCategory",
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
        } else if (store.products && store.products.length > 2500) {
          store.products.pop();
        }
      }

      // 每次循环暂停100ms
      const progress = (((i + 1) / totalIterations) * 100).toFixed(1);
      const elapsedMinutes = (((i + 1) * 100) / 1000 / 60).toFixed(1);
      setStatus(
        `测试进行中... ${i + 1}/${totalIterations} (${progress}%) - 已用时${elapsedMinutes}分钟`,
      );

      // 每100次循环输出一次日志
      if (i % 100 === 0) {
        console.log(
          `进度: ${i}/${totalIterations} (${progress}%), users: ${store.users?.length || 0}, products: ${store.products?.length || 0}`,
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    clearInterval(memoryInterval);
    updateChart(); // 最后记录一次
    console.log("测试完成");
    setStatus("测试完成");
    testRunningRef.current = false;
  };

  useEffect(() => {
    // 初始化 echarts
    if (chartRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
      chartInstanceRef.current.setOption({
        title: { text: title, left: "center", textStyle: { fontSize: 12 } },
        grid: { left: "50px", right: "20px", top: "40px", bottom: "30px" },
        xAxis: { type: "category", data: [], name: "时间(s)", nameTextStyle: { fontSize: 10 } },
        yAxis: { type: "value", name: "内存(MB)", nameTextStyle: { fontSize: 10 } },
        series: [{ data: [], type: "line", smooth: true }],
      });
    }

    // 监听窗口大小变化
    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    // 自动开始测试
    const timer = setTimeout(() => {
      console.log("开始测试...");
      startTest();
    }, 1000);

    return () => {
      console.log("清理资源");
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      chartInstanceRef.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    chartRef,
    status,
    currentMemory,
    arrayLength,
  };
};
