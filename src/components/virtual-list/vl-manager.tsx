import * as _ from "lodash-es";

interface VerticalRenderRange {
  topIndex: number;
  topBlank: number;
  bottomIndex: number;
  bottomBlank: number;
}

interface VLManagerConfig {
  len: number; // 数组长度
  presetHeight: number; // 每项预设高度
  bufferSize: number; // 缓冲区大小
  forceRenderIdx?: number[]; // 强制渲染的索引数组，注意：extraOfBottom的索引也会在其中
}

export class VLManager {
  protected len: number;
  protected presetHeight: number;
  protected bufferSize: number;
  cache: number[] = [];

  constructor(config: VLManagerConfig) {
    this.len = config.len;
    this.presetHeight = config.presetHeight;
    this.bufferSize = config.bufferSize;

    this.cache = new Array(this.len).fill(config.presetHeight);
  }

  get MAX_OVERSCAN_SIZE() {
    return this.bufferSize * this.presetHeight;
  }

  protected getStart = (scrollTop: number) => {
    if (this.cache.length === 0) {
      return { topIndex: 0, topBlank: 0 };
    }
    let topIndex = 0,
      topBlank = 0;

    while (topIndex < this.cache.length) {
      if (topBlank + this.cache[topIndex] >= scrollTop) {
        break;
      }
      topBlank += this.cache[topIndex++];
    }
    return this.overscanUpwards(topIndex, topBlank);
  };

  protected overscanUpwards = (topIndex: number, topBlank: number) => {
    let overscanSize = 0;
    let overscanCount = 0;
    while (overscanCount < topIndex && overscanSize < this.MAX_OVERSCAN_SIZE) {
      overscanCount += 1;
      overscanSize += this.cache[topIndex - overscanCount];
    }
    return {
      topIndex: topIndex - overscanCount,
      topBlank: topBlank - overscanSize,
    };
  };

  protected overscanDownwards = (bottomIndex: number, bottomBlank: number) => {
    let downIndex = 0;
    let downBlank = 0;
    while (downIndex < this.len - bottomIndex && downBlank < this.MAX_OVERSCAN_SIZE) {
      downBlank += this.cache[bottomIndex + downIndex];
      downIndex++;
    }

    return { bottomIndex: downIndex + bottomIndex, bottomBlank: bottomBlank - downBlank };
  };

  /** 获取虚拟滚动 在结束位置上的信息 */
  protected getEnd = (
    endOffset: number,
    startInfo: Pick<VerticalRenderRange, "topIndex" | "topBlank">,
  ) => {
    let bottomIndex = startInfo.topIndex;
    let offsetTopBucket = startInfo.topBlank;

    while (bottomIndex < this.len && offsetTopBucket < endOffset) {
      offsetTopBucket += this.cache[bottomIndex++];
    }
    const bottomBlank = _.sum(this.cache) - offsetTopBucket;
    return this.overscanDownwards(bottomIndex, bottomBlank);
  };

  getRenderRange = (config: {
    offsetOfTop: number;
    maxRenderHeight: number;
    len: number;
    forceRenderIdx?: number[];
  }) => {
    this.len = config.len;
    const start = this.getStart(config.offsetOfTop);
    const end = this.getEnd(config.offsetOfTop + config.maxRenderHeight, start);

    return { ...start, ...end };
  };

  setCache = (index: number, height: number) => {
    this.cache[index] = height;
    // @ts-ignore
    window.cache_ = this.cache;
    return this.cache[index] === height;
  };
}
