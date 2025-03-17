import { FC, useCallback, useRef, useState, useEffect } from "react";
import { Button, Space, Switch } from "antd";

interface IProps {
  name?: string;
}

function waitSync(ms: number) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // 同步等待
  }
}
const TestPage2: FC<IProps> = () => {
  // 使用 useState 来管理列表数据和高度状态
  const [items, setItems] = useState<number[]>(
    Array.from({ length: 50 }).map((_, index) => index + 1),
  );
  const [wrapHeight] = useState<number>(500);
  // 将单选改为多选，使用 Set 来存储选中的项
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  // 使用 Map 来存储每个选中项的高度
  const [itemHeights, setItemHeights] = useState<Map<number, number>>(new Map());
  // 添加自动增加开关状态
  const [autoIncrement, setAutoIncrement] = useState<boolean>(false);

  // 用于存储最大序号的ref
  const maxNumberRef = useRef<number>(50);
  // 用于节流的timeout ref
  const throttleTimerRef = useRef<number | null>(null);

  // 添加最大数量限制
  const MAX_ITEMS = 5000;

  // 添加一个ref来记录上次滚动的位置
  const lastScrollTopRef = useRef<number>(0);
  // 定义滚动距离阈值
  const SCROLL_THRESHOLD = 200;

  // 随机生成 100-300 之间的高度
  const getRandomHeight = () => Math.floor(Math.random() * 201) + 100;

  // 切换选中元素的高度
  const toggleItemHeight = () => {
    if (selectedItems.size === 0) {
      // 如果没有选中元素，选择第一个
      const newSelectedItems = new Set([0]);
      setSelectedItems(newSelectedItems);
      setItemHeights(new Map([[0, getRandomHeight()]]));
    } else {
      // 为所有选中的元素设置新的随机高度
      const newHeights = new Map(itemHeights);
      selectedItems.forEach((index) => {
        newHeights.set(index, getRandomHeight());
      });
      setItemHeights(newHeights);
    }
  };

  // 修改 handleUpdateItems 函数，在顶部添加元素但不移除底部元素
  const handleUpdateItems = useCallback(
    (count: number = 1) => {
      setItems((prevItems) => {
        // 如果已经达到最大数量，不再添加
        if (prevItems.length >= MAX_ITEMS) {
          return prevItems;
        }

        // 计算实际可以添加的数量（不超过最大限制）
        const actualCount = Math.min(count, MAX_ITEMS - prevItems.length);

        // 生成新的元素数组
        const newItems = Array.from({ length: actualCount }).map(() => {
          maxNumberRef.current += 1;
          return maxNumberRef.current;
        });

        // 创建新数组：在开头添加新元素，保留所有现有元素
        return [...newItems, ...prevItems];
      });

      // 更新选中项的索引（因为所有项都向下移动了）
      const newSelectedItems = new Set(
        Array.from(selectedItems)
          .map((index) => index + count)
          .filter((index) => index < items.length + count),
      );
      setSelectedItems(newSelectedItems);

      // 更新高度 Map
      const newHeights = new Map();
      itemHeights.forEach((height, index) => {
        newHeights.set(index + count, height);
      });
      setItemHeights(newHeights);
    },
    [items.length, selectedItems, itemHeights],
  );

  // 修改滚动处理函数
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!autoIncrement) return;
      if (throttleTimerRef.current !== null) return;
      if (items.length >= MAX_ITEMS) return;

      const element = e.currentTarget;
      if (!element) return;

      const currentScrollTop = Math.abs(element.scrollTop);
      const scrollDiff = Math.abs(currentScrollTop - lastScrollTopRef.current);

      // 当滚动距离达到阈值时触发，一次添加5个元素
      if (scrollDiff >= SCROLL_THRESHOLD) {
        throttleTimerRef.current = window.setTimeout(() => {
          handleUpdateItems(5); // 每次添加5个元素
          // 更新上次滚动位置
          lastScrollTopRef.current = currentScrollTop;
          throttleTimerRef.current = null;
        }, 100);
      }
    },
    [autoIncrement, handleUpdateItems, items.length],
  );

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (throttleTimerRef.current !== null) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, []);

  // 当自动增加开关关闭时，重置滚动位置记录
  useEffect(() => {
    if (!autoIncrement) {
      lastScrollTopRef.current = 0;
    }
  }, [autoIncrement]);

  // 处理元素点击，实现多选
  const handleItemClick = (index: number) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(index)) {
      newSelectedItems.delete(index);
      const newHeights = new Map(itemHeights);
      newHeights.delete(index);
      setItemHeights(newHeights);
    } else {
      newSelectedItems.add(index);
      const newHeights = new Map(itemHeights);
      newHeights.set(index, itemHeights.get(index) || 200);
      setItemHeights(newHeights);
    }
    setSelectedItems(newSelectedItems);
  };

  return (
    <>
      <div style={{ width: "500px", height: "500px", overflow: "auto" }} onScroll={handleScroll}>
        <div
          className="wrap"
          style={{
            height: `${wrapHeight}px`,
            transition: "height 0.3s",
            backgroundColor: "#f0f0f0",
            padding: "10px",
          }}
        >
          {items.map((item, index) => (
            <ListItem
              key={item}
              item={item}
              index={index}
              height={itemHeights.get(index) || 200}
              isSelected={selectedItems.has(index)}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </div>
      </div>

      <Space direction="vertical" style={{ marginTop: "20px" }}>
        <Space>
          <span>滚动时自动增加元素：</span>
          <Switch
            checked={autoIncrement}
            onChange={setAutoIncrement}
            disabled={items.length >= MAX_ITEMS} // 达到最大数量时禁用开关
          />
          <span style={{ fontSize: "12px", color: "#999" }}>
            ({items.length}/{MAX_ITEMS})
          </span>
        </Space>

        <Button
          type="primary"
          onClick={() => handleUpdateItems(1)} // 手动点击时只添加1个元素
          disabled={items.length >= MAX_ITEMS}
        >
          顶部添加元素，底部移除元素
        </Button>

        <Button type="primary" onClick={toggleItemHeight}>
          随机改变选中元素高度 {selectedItems.size > 0 && `(当前选中: ${selectedItems.size}个元素)`}
        </Button>
      </Space>
    </>
  );
};

export default TestPage2;

// 单个列表项组件
const ListItem = ({
  item,
  index,
  height,
  isSelected,
  onClick,
}: {
  item: string;
  index: number;
  height: number;
  isSelected: boolean;
  onClick: () => void;
}) => {
  waitSync(200);
  return (
    <div
      className="item"
      data-index={index}
      key={item}
      style={{
        height: `${height}px`,
        backgroundColor: isSelected ? "#ff9999" : "pink",
        marginBottom: "5px",
        transition: "height 0.3s",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {item} {isSelected && `(已选中 高度:${height}px)`}
    </div>
  );
};
