type EventHandler = (...args: any[]) => void;

const logedNames: string[] = [];
class EventBus {
  private events: { [eventName: string]: EventHandler[] } = {};
  private readonly MAX_HANDLERS = 11;

  on = (eventName: string, handler: EventHandler): (() => void) => {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    if (this.events[eventName].length >= this.MAX_HANDLERS && !logedNames.includes(eventName)) {
      console.warn(
        `[EventBus] 事件 ${eventName} 的监听器数量超过 ${this.MAX_HANDLERS} 个(${this.events[eventName].length}个),可能存在内存泄漏风险`,
      );
      logedNames.push(eventName);
    }

    this.events[eventName].push(handler);

    return () => {
      this.off(eventName, handler);
    };
  };

  emit = (eventName: string, ...args: any[]): void => {
    const handlers = this.events[eventName];
    if (handlers) {
      handlers.forEach((handler) => handler(...args));
    }
  };

  off = (eventName: string, handler: EventHandler): void => {
    if (this.events[eventName]) {
      const index = this.events[eventName].indexOf(handler);
      if (index !== -1) {
        this.events[eventName].splice(index, 1);
      }
    }
  };
}

export const eventBus = new EventBus();

export const EventBusConstants = {
  "vl:mounted": "vl:mounted",
};
