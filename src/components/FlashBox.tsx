import React, { useRef, useEffect } from "react";

interface FlashBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  deps?: any[]; // 依赖项，当依赖项变化时触发闪烁
  children?: React.ReactNode;
}

/**
 * 通用闪烁容器组件
 * 当deps中的依赖项变化时，会自动闪烁（黑底白字200ms）
 * deps为空或不传时，每次组件更新都会闪烁
 */
export const FlashBox: React.FC<FlashBoxProps> = ({ deps, children, style, ...props }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const originalStyleRef = useRef<{ bg: string; color: string } | null>(null);
  const isFlashingRef = useRef(false);

  useEffect(() => {
    // 直接操作 DOM 样式，不触发 React 重渲染
    const element = divRef.current;
    if (!element) return;

    // 只在第一次或非闪烁状态时保存原始样式
    if (!isFlashingRef.current) {
      originalStyleRef.current = {
        bg: element.style.background,
        color: element.style.color,
      };
    }

    // 标记正在闪烁
    isFlashingRef.current = true;

    // 应用闪烁样式
    element.style.background = "#eee";
    element.style.color = "#000";
    element.style.transition = "all 0.01s";

    // 100ms 后恢复原样式
    const timer = setTimeout(() => {
      if (originalStyleRef.current) {
        element.style.background = originalStyleRef.current.bg;
        element.style.color = originalStyleRef.current.color;
      }
      // 标记闪烁结束
      isFlashingRef.current = false;
    }, 100);

    return () => clearTimeout(timer);
  }, deps);

  return (
    <div ref={divRef} {...props} style={style}>
      {children}
    </div>
  );
};
