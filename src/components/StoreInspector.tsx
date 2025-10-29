import React, { useState, useRef, useEffect } from "react";

interface StoreInspectorProps {
  storeName: string;
  store: any;
}

export const StoreInspector: React.FC<StoreInspectorProps> = ({ storeName, store }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 提取store的所有属性(包括computed)
  const getStoreData = () => {
    const data: any = {};
    const proto = Object.getPrototypeOf(store);

    // 获取普通属性
    Object.keys(store).forEach((key) => {
      if (!key.startsWith("_")) {
        try {
          data[key] = store[key];
        } catch (e) {
          data[key] = "[error]";
        }
      }
    });

    // 获取computed属性(getter)
    Object.getOwnPropertyNames(proto).forEach((key) => {
      if (key !== "constructor") {
        const descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (descriptor && descriptor.get) {
          try {
            data[`${key}(c)`] = store[key];
          } catch (e) {
            data[`${key}(c)`] = "[error]";
          }
        }
      }
    });

    return data;
  };

  const handleMouseEnter = () => {
    // 取消之前的关闭定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    // 延迟300ms关闭，给足够时间移动鼠标到tooltip
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div style={containerStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <span style={triggerStyle}>[{storeName}]</span>

      {isVisible && (
        <div style={tooltipStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div style={headerStyle}>{storeName}</div>
          <pre style={contentStyle}>{JSON.stringify(getStoreData(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: "inline-block",
  position: "relative",
};

const triggerStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#666",
  cursor: "help",
  borderBottom: "1px dotted #999",
  fontFamily: "monospace",
};

const tooltipStyle: React.CSSProperties = {
  position: "absolute",
  left: "0",
  top: "18px",
  background: "#fff",
  border: "1px solid #999",
  padding: "8px",
  zIndex: 1000,
  minWidth: "200px",
  maxWidth: "400px",
  maxHeight: "400px",
  overflow: "auto",
  boxShadow: "2px 2px 4px rgba(0,0,0,0.1)",
};

const headerStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "4px",
  paddingBottom: "2px",
  borderBottom: "1px solid #ddd",
  fontFamily: "monospace",
};

const contentStyle: React.CSSProperties = {
  fontSize: "13px",
  margin: 0,
  lineHeight: "1.3",
  fontFamily: "monospace",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
};
