import React, { useState, useEffect } from "react";
import { makeAutoObservable } from "../lib/makeAutoObservable";
import { useMemoryTest } from "../hooks/useMemoryTest";
import { MemoryTestLayout } from "../components/MemoryTestLayout";

// 自研 Store
class MyTestStore {
  users: any[] = [];
  products: any[] = [];
}

const MemoryTestComponent: React.FC = () => {
  const [store] = useState(() => makeAutoObservable(new MyTestStore()));
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    // 从URL获取测试时长
    const params = new URLSearchParams(window.location.search);
    const durationParam = params.get("duration");
    if (durationParam) {
      setDuration(Number(durationParam));
    }
  }, []);

  const { chartRef, status, currentMemory, arrayLength } = useMemoryTest({
    title: "自研Store - 内存占用",
    store,
    getArrayLength: () => (store.users?.length || 0) + (store.products?.length || 0),
    durationMinutes: duration,
  });

  return (
    <MemoryTestLayout
      title="自研Store - 内存占用"
      chartRef={chartRef}
      status={status}
      currentMemory={currentMemory}
      dataStats={{
        total: arrayLength,
        users: store.users?.length || 0,
        products: store.products?.length || 0,
      }}
      store={store}
    />
  );
};

export const ReliabilityMemoryMyStore: React.FC = () => {
  return <MemoryTestComponent />;
};
