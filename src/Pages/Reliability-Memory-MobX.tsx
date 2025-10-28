import React, { useState, useEffect } from "react";
import { makeAutoObservable as mobxMakeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { useMemoryTest } from "../hooks/useMemoryTest";
import { MemoryTestLayout } from "../components/MemoryTestLayout";

// MobX Store
class MobXTestStore {
  users: any[] = [];
  products: any[] = [];

  constructor() {
    mobxMakeAutoObservable(this);
  }
}

const MemoryTestComponent: React.FC = observer(() => {
  const [store] = useState(() => new MobXTestStore());
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
    title: "MobX - 内存占用",
    store,
    getArrayLength: () => (store.users?.length || 0) + (store.products?.length || 0),
    durationMinutes: duration,
  });

  return (
    <MemoryTestLayout
      title="MobX - 内存占用"
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
});

export const ReliabilityMemoryMobX: React.FC = () => {
  return <MemoryTestComponent />;
};
