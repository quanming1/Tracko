import React from "react";
import { VLItemWrap } from "./Components";
import * as _ from "lodash-es";

export interface IVisibleRow<Row> {
  item: Row;
  index: number;
  forceRender?: boolean;
}

interface VirtualRowsProps<Row> {
  visibleRows: IVisibleRow<Row>[];
  eachUukey: (row: Row, index: number) => string | number;
  renderRow: (row: Row, rowIndex: number) => React.ReactElement;
  itemStyle?: React.CSSProperties;
  randNum: number;
  vnodeKey: (row: Row, rowIndex: number) => string;
}

export const VirtualRows = React.memo(
  <Row,>({
    visibleRows,
    eachUukey,
    renderRow,
    itemStyle,
    randNum,
    vnodeKey,
  }: VirtualRowsProps<Row>) => {
    return (
      <>
        {visibleRows.map(({ item, index, forceRender }) => {
          const k = eachUukey(item, index) + "" + randNum;
          return (
            <VLItemWrap
              forceRender={forceRender}
              index={index}
              style={itemStyle || {}}
              key={vnodeKey(item, index)}
              uukey={k}
            >
              {renderRow(item, index)}
            </VLItemWrap>
          );
        })}
      </>
    );
  },
  (pre, cur) => {
    return (
      _.isEqual(pre.visibleRows, cur.visibleRows) &&
      pre.eachUukey === cur.eachUukey &&
      pre.renderRow === cur.renderRow &&
      _.isEqual(pre.itemStyle, cur.itemStyle) &&
      pre.randNum === cur.randNum
    );
  },
) as <Row>(props: VirtualRowsProps<Row>) => React.ReactElement;
