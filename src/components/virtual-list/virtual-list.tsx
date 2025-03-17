/* eslint-disable no-unreachable */
/* eslint-disable no-param-reassign */
import cx from "classnames";
import * as _ from "lodash-es";
import React, { createContext, useContext, useEffect } from "react";
import { merge, Subscription } from "rxjs";
import { combindRef, fromResizeEvent, fromScrollEvent } from "./helper";
import { VLManager } from "./vl-manager";
import { VLItemWrap } from "./Components";
import { IVisibleRow, VirtualRows } from "./VirtualRows";
import { isScrollElement } from "./helper";
import { eventBus } from "./event-bus";
import { EventBusConstants } from "./event-bus";

const VLConfig = {
  isResetMutation: false, // 重置突变高度
} as const;

export const prefixVLClassname = (classname: string): string => `__vl-${classname}`;

// @ts-check
export interface VirtualListProps<Row> {
  rows: Row[]; // 需要渲染的数据列表
  renderRow(row: Row, rowIndex: number): React.ReactElement; // 渲染每个item的函数
  presetHeight: number; // 预设的每个item的高度
  style?: React.CSSProperties; // 容器样式
  className?: string; // 容器类名
  containerRef?: React.ForwardedRef<HTMLDivElement>; // 容器ref
  bufferSize?: number; // 缓冲区大小
  itemStyle?: React.CSSProperties; // 每个item的样式
  eachUukey?: (item: Row, index: number) => string; // 获取每个item的唯一key
  extraOfBottom?: React.ReactElement | React.ReactElement[]; // 底部额外渲染
  extraOfBottomKey?: string | string[]; // 底部额外渲染的key
  forceRenderItem?: ((item: Row, index: number) => boolean) | number[]; // 强制渲染的item项
  listContainerStyle?: React.CSSProperties; // 列表容器样式
  containerDomRef?: React.RefObject<HTMLDivElement>; // 容器dom ref
  saveRenderedIndex?: boolean; // 是否保存渲染过的索引

  // 默认滚动到底部
  defaultScrollToBottom?: boolean;
}

interface VirtualListState {
  offset: number;
  viewHeight: number;
}
export const VirtualListContext = createContext<{
  changeHeight: (index: number, height: number) => void;
  VLConfig: typeof VLConfig;
  globalStateCache: Map<string, unknown>; // 全局状态缓存，给useCacheState使用
  registerDistory: (callback: (...args: any[]) => any) => void; // 注册销毁回调
}>({
  changeHeight: () => {},
  VLConfig: VLConfig,
  globalStateCache: new Map(),
  registerDistory: () => {},
});

export const useVirtualListDestroy = (callback: (...args: any[]) => any) => {
  const context = useContext(VirtualListContext);
  useEffect(() => {
    if (context.registerDistory) {
      context.registerDistory(callback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

//暴露单例
export const vlSingletonRef = {
  current: null as VirtualList<any> | null,
};

/**
 * 虚拟滚动列表组件
 */
export class VirtualList<Row> extends React.Component<VirtualListProps<Row>, VirtualListState> {
  readonly containerRef = React.createRef<HTMLDivElement>();
  readonly wrapRef = React.createRef<HTMLDivElement>();
  readonly bottomBlankRef = React.createRef<HTMLDivElement>();
  private readonly globalStateCache = new Map<string, any>();
  private readonly distoryCallbacks: ((...args: any[]) => any)[] = [];
  private readonly renderedIndex = new Set<number>(); // 渲染过的索引
  private firstFlag = false;
  private startCollectRenderedFlag = false; // 开始收集渲染过的索引 标志

  constructor(props: VirtualListProps<Row>) {
    super(props);

    this.manager = new VLManager({
      len: this.totalLength,
      presetHeight: props.presetHeight,
      bufferSize: props.bufferSize || 10,
    });
  }

  protected randNum = Math.random();

  private manager: VLManager;

  get container() {
    return this.containerRef.current;
  }
  // 计算总长度
  get totalLength() {
    return this.props.rows.length + this.extraOfBottomLength;
  }
  // 计算底部额外渲染的元素数量
  get extraOfBottomLength() {
    return this.props.extraOfBottom
      ? Array.isArray(this.props.extraOfBottom)
        ? this.props.extraOfBottom.length
        : 1
      : 0;
  }

  get isAllRender() {
    const isAllRender =
      this.props.bufferSize === -1 || this.renderedIndex.size >= this.props.rows.length;
    return isAllRender;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public scrollToBottom(behavior: "auto" | "smooth" | "instant" = "smooth", flag = false) {
    if (!this.bottomBlankRef.current) return;

    for (let i = 0; i <= 5; i++) {
      if (flag) {
        setTimeout(() => {
          if (!this.utils.isAtBottom()) {
            this.bottomBlankRef?.current?.scrollIntoView({
              // @ts-ignore
              behavior: "instant",
              block: "end",
            });
          }
        }, i * 50);
      } else {
        this.bottomBlankRef?.current?.scrollIntoView({
          // @ts-ignore
          behavior: "instant",
          block: "end",
        });
      }
    }
  }

  private subscription: Subscription | null = null;

  state = {
    offset: 0,
    viewHeight: 400,
  };

  componentDidMount() {
    const scrollParent = this.wrapRef.current!;
    const subscription = merge(fromScrollEvent(scrollParent), fromResizeEvent(scrollParent));
    this.subscription = subscription.subscribe(() => {
      if (this.isAllRender && this.firstFlag) return;
      this.firstFlag = true;
      const top =
        scrollParent.getBoundingClientRect().top - this.container!.getBoundingClientRect().top;
      // if (Math.abs(this.state.offset - top) >= this.props.presetHeight) {
      this.handleCalcState();
      // }
    });

    vlSingletonRef.current = this;
    eventBus.emit(EventBusConstants["vl:mounted"], this.wrapRef.current!);

    if (this.props.defaultScrollToBottom) {
      this.scrollToBottom("instant", true);
    }
  }

  protected handleCalcState = () => {
    const scrollParent = this.wrapRef.current!;
    // 检查是否真的变化了
    const newViewHeight = scrollParent.clientHeight;
    const newOffset =
      scrollParent.getBoundingClientRect().top - this.container!.getBoundingClientRect().top;
    if (newViewHeight !== this.state.viewHeight || newOffset !== this.state.offset) {
      this.setState(() => ({
        viewHeight: newViewHeight,
        offset: newOffset,
      }));
    }
  };

  componentWillUnmount() {
    this.subscription?.unsubscribe();
    // 清除全局状态缓存
    this.globalStateCache.clear();
    // 执行销毁回调
    this.distoryCallbacks.forEach((callback) => callback?.());

    vlSingletonRef.current = null;
  }

  /**
   * 获取强制渲染的索引
   * @returns 强制渲染的索引
   */
  private getForceRenderIdx(): number[] {
    const { rows, forceRenderItem } = this.props;
    const forceRenderIdxSet = new Set<number>(
      this.props.saveRenderedIndex ? this.renderedIndex : undefined,
    );
    if (typeof forceRenderItem === "function") {
      rows.forEach((row, index) => {
        if (forceRenderItem(row, index)) {
          forceRenderIdxSet.add(index);
        }
      });
    } else if (Array.isArray(forceRenderItem)) {
      forceRenderItem.forEach((idx) => forceRenderIdxSet.add(idx));
    }

    for (let i = 0; i < this.extraOfBottomLength; i++) {
      forceRenderIdxSet.add(i + this.props.rows.length);
    }
    return Array.from(forceRenderIdxSet);
  }

  protected getVisibleRows() {
    // 渲染全部：
    if (this.isAllRender) {
      return {
        visibleRows: ([] as Row[])
          .concat(
            this.props.rows as Row[],
            (Array.isArray(this.props.extraOfBottom) ? this.props.extraOfBottom : []) as Row[],
          )
          .map((row, index) => ({
            item: row,
            index,
            forceRender: false,
          })),

        range: {
          topIndex: 0,
          bottomIndex: this.props.rows.length,
          topBlank: 0,
          bottomBlank: 0,
        },
      };
    }

    const { rows } = this.props;
    const { offset, viewHeight } = this.state;
    const forceRenderIdx = this.getForceRenderIdx();

    // 获取可视区域范围
    const range = this.manager.getRenderRange({
      offsetOfTop: offset,
      maxRenderHeight: viewHeight,
      len: this.totalLength,
      // forceRenderIdx
    });

    const visibleRowsWrapList: IVisibleRow<Row>[] = rows
      .slice(range.topIndex, range.bottomIndex)
      .map((row, i) => ({
        item: row,
        index: range.topIndex + i,
        forceRender: forceRenderIdx.includes(range.topIndex + i),
      }));

    // 总是渲染
    forceRenderIdx.forEach((index) => {
      if (!visibleRowsWrapList.find((item) => item.index === index) && rows[index]) {
        const item = rows[index];
        visibleRowsWrapList.push({
          item,
          index,
          forceRender: true,
        });
        // 在渲染区域外
        if (index < range.topIndex || index >= range.bottomIndex) {
          range.bottomBlank -= this.manager.cache[index] || 0;
        }
        range.bottomBlank = Math.max(range.bottomBlank, 0);
      }
    });
    visibleRowsWrapList.sort((a, b) => a.index - b.index);

    return {
      visibleRows: visibleRowsWrapList,
      range,
    };
  }

  changeHeight = (index: number, height: number) => {
    if (this.manager) {
      const isSame = this.manager.setCache(index, height);
      if (!isSame) {
        this.handleCalcState();
      }
    }
  };

  forceResetUUKey = () => {
    this.randNum = Math.random();
    this.forceUpdate();
  };

  registerDistory = (callback: (...args: any[]) => any) => {
    if (!this.distoryCallbacks.includes(callback)) {
      this.distoryCallbacks.push(callback);
    }
  };

  public utils = {
    isAtBottom: (distance: number = 10): boolean => {
      if (!this.wrapRef.current) return false;
      if (!isScrollElement(this.wrapRef.current)) return true;
      return (
        this.wrapRef.current.scrollHeight -
          this.wrapRef.current.scrollTop -
          this.wrapRef.current.offsetHeight <
        distance
      );
    },
  };

  render() {
    const {
      renderRow,
      style,
      className,
      extraOfBottom: extraOfBottom_,
      extraOfBottomKey: extraOfBottomKey_,
    } = this.props;
    const { visibleRows, range } = this.getVisibleRows();
    if (this.props.defaultScrollToBottom && range.bottomIndex === this.props.rows.length) {
      // 必须要等到滚动到底部，才开始收集渲染过的索引
      this.startCollectRenderedFlag = true;
    } else if (!this.props.defaultScrollToBottom) {
      // 如果默认不滚动到底部，则一开始就开始收集渲染过的索引
      this.startCollectRenderedFlag = true;
    }

    if (this.props.saveRenderedIndex && !this.isAllRender && this.startCollectRenderedFlag) {
      visibleRows.forEach((item) => {
        this.renderedIndex.add(item.index);
      });
    }

    const eachUukey = this.props.eachUukey || ((_, index) => index);
    const extraOfBottom = Array.isArray(extraOfBottom_) ? extraOfBottom_ : [extraOfBottom_];
    const extraOfBottomKey = Array.isArray(extraOfBottomKey_)
      ? extraOfBottomKey_
      : [extraOfBottomKey_];

    return (
      <VirtualListContext.Provider
        value={{
          changeHeight: this.changeHeight,
          VLConfig,
          globalStateCache: this.globalStateCache,
          registerDistory: this.registerDistory,
        }}
      >
        <div
          ref={combindRef(this.wrapRef, this.props.containerDomRef)}
          style={{ overflow: "auto", overflowX: "hidden", ...style }}
          id={prefixVLClassname("wrap")}
        >
          <div
            ref={this.containerRef}
            style={{ position: "relative", ...(this.props.listContainerStyle || {}) }}
            className={cx(className)}
          >
            <div data-top-blank="true" style={{ height: range.topBlank }} />
            <VirtualRows
              visibleRows={visibleRows}
              eachUukey={eachUukey}
              renderRow={renderRow}
              itemStyle={this.props.itemStyle}
              randNum={this.randNum}
              vnodeKey={(_, index) => `vl-item::${index}`}
            />

            {extraOfBottom.map((extraOfBottomItem, i) => {
              const index = i + this.props.rows.length;
              const key = `${"extra-of-bottom::"}${extraOfBottomKey[i]}-${index}`;
              return (
                <VLItemWrap
                  key={`${"extra-of-bottom"}::${index}`}
                  extraofBottom
                  index={index}
                  uukey={key}
                >
                  {extraOfBottomItem}
                </VLItemWrap>
              );
            })}

            <div
              data-bottom-blank="true"
              ref={this.bottomBlankRef}
              style={{ height: range.bottomBlank }}
            />
          </div>
        </div>
      </VirtualListContext.Provider>
    );
  }
}
