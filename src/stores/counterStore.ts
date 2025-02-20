import { makeAutoObservable } from "mobx";

export class CounterStore {
  count = 0;
  history: number[] = [];

  constructor() {
    // 使用 makeAutoObservable 自动将所有属性和方法变成可观察的
    makeAutoObservable(this);
  }

  increment = (): void => {
    this.count += 1;
    this.history.push(this.count);
  };

  decrement = (): void => {
    this.count -= 1;
    this.history.push(this.count);
  };

  // 计算属性：获取操作次数
  get operationCount(): number {
    return this.history.length;
  }

  // 重置计数器
  reset = (): void => {
    this.count = 0;
    this.history = [];
  };
}

export const counterStore = new CounterStore();
