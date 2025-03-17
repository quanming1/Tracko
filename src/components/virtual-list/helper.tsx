import { useRef, useState, useLayoutEffect } from "react";
import { fromEvent, Observable } from "rxjs";
import { vlSingletonRef } from "./virtual-list";
import * as _ from "lodash-es";
import { eventBus } from "./event-bus";
import { EventBusConstants } from "./event-bus";
import { useUnmount } from "ahooks";

export function fromScrollEvent(element: HTMLElement | Window) {
  return fromEvent(element, "scroll");
}
export function fromResizeEvent(
  element: HTMLElement | Window,
): Observable<Event | ResizeObserverEntry[]> {
  if (element === self) {
    return fromEvent<Event>(element, "resize");
  }

  return new Observable((subscriber) => {
    const resizeObserver = new ResizeObserver((entries: any[]) => {
      subscriber.next(entries);
    });
    resizeObserver.observe(element as HTMLElement);

    return () => {
      resizeObserver.disconnect();
    };
  });
}

type Noop = (...props: any[]) => any;
export function execTime(fn: Noop) {
  const startTime = performance.now();
  fn();
  const endTime = performance.now();
  return endTime - startTime;
}

/**
 * 合并多个 ref
 * @param refList 需要合并的ref列表
 * @returns 合并后的ref函数
 */
export function combindRef<T>(
  ...refList: (React.MutableRefObject<T | null> | React.RefCallback<T> | null | undefined)[]
) {
  return (target: T | null) => {
    refList.forEach((ref) => {
      if (typeof ref === "function") {
        ref(target);
      } else if (ref) {
        ref.current = target;
      }
    });
  };
}

export function useIsAtBottom(distance: number = 10) {
  const [isAtBottom, setIsAtBottom] = useState(() => {
    if (vlSingletonRef.current) {
      return !!vlSingletonRef.current?.utils.isAtBottom(distance);
    }
    return true;
  });
  const removeEvent = useRef<() => void>(() => {});

  const handleWrap = (wrap: HTMLElement) => {
    const handleScroll = _.throttle(() => {
      const is = vlSingletonRef.current?.utils.isAtBottom(distance);
      setIsAtBottom(is || false);
    }, 200);
    wrap.addEventListener("scroll", handleScroll);
    removeEvent.current = () => {
      wrap.removeEventListener("scroll", handleScroll);
    };
  };

  useLayoutEffect(() => {
    const wrap = vlSingletonRef.current?.wrapRef.current;
    if (wrap) {
      handleWrap(wrap);
    } else {
      return eventBus.on(EventBusConstants["vl:mounted"], (wrap: HTMLElement) => {
        handleWrap(wrap);
      });
    }
  }, [distance, vlSingletonRef.current?.wrapRef.current]);

  useUnmount(() => {
    if (removeEvent.current) {
      removeEvent.current();
    }
  });

  return isAtBottom;
}

export function isScrollElement(element: HTMLElement | Window) {
  return element instanceof HTMLElement && element.scrollHeight > element.clientHeight;
}
