interface SubItem {
  label: string;
  data: number[];
}

interface Item {
  id: number;
  name: string;
  subItems: SubItem[];
}

export class CounterStore {
  count = 1;
  history: number[] = [];
  private rawMessage = [];

  // 深度嵌套: 数组→对象→数组→对象→数组
  items: Item[] = [
    {
      id: 1,
      name: "group1",
      subItems: [
        { label: "sub1", data: [1, 2, 3] },
        { label: "sub2", data: [4, 5] },
      ],
    },
    {
      id: 2,
      name: "group2",
      subItems: [{ label: "sub3", data: [6, 7, 8, 9] }],
    },
  ];

  get message() {
    return this.rawMessage;
  }

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
