export class CounterStore {
  count = 1;
  history: number[] = [];

  get double() {
    console.log("计算 double");
    return this.count * 2;
  }

  get quadruple() {
    console.log("计算 quadruple (依赖 double)");
    return this.double * 2;
  }

  get octuple() {
    console.log("计算 octuple (依赖 quadruple，三层嵌套)");
    return this.quadruple * 2;
  }

  get historyLength() {
    console.log("计算 historyLength");
    return this.history.length;
  }
}
