export class UserStore {
  name = "游客";
  age = 18;
  email = "";
  city = "";

  // 对象属性
  profile = {
    avatar: "https://avatar.example.com/default.png",
    bio: "这是我的个人简介",
    level: 1,
    email: "user@example.com",
    phone: "13800138000",
    badges: {
      // 对象套对象
      achievement: "新手",
      points: 100,
    },
  };

  // 普通数组
  tags = ["前端", "React", "TypeScript"];

  // 数组套对象
  friends = [
    { id: 1, name: "张三", age: 25 },
    { id: 2, name: "李四", age: 28 },
    { id: 3, name: "王五", age: 30 },
  ];

  // 对象套数组
  permissions = {
    admin: false,
    roles: ["user", "member"],
    features: [
      { name: "read", enabled: true },
      { name: "write", enabled: false },
      { name: "delete", enabled: false },
    ],
  };

  // 复杂嵌套：大数组测试（用于测试 Proxy 的性能优势）
  posts = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `文章标题 ${i + 1}`,
    content: `这是第 ${i + 1} 篇文章的内容`,
    comments: [
      { userId: 1, text: "评论1" },
      { userId: 2, text: "评论2" },
    ],
    likes: i * 10,
  }));

  get displayName() {
    console.log("计算 displayName");
    return `${this.name} (${this.age}岁)`;
  }

  get fullInfo() {
    console.log("计算 fullInfo");
    return {
      name: this.name,
      age: this.age,
      email: this.email,
      city: this.city,
    };
  }

  // 添加一些操作方法（箭头函数，测试 this 指向）
  addFriend = (friend: { id: number; name: string; age: number }) => {
    console.log("添加好友", friend);
    this.friends.push(friend);
  };

  updateProfile = (updates: Partial<typeof this.profile>) => {
    console.log("更新资料", updates);
    Object.assign(this.profile, updates);
  };

  addTag = (tag: string) => {
    console.log("添加标签", tag);
    this.tags.push(tag);
  };

  togglePermission = (featureName: string) => {
    console.log("切换权限", featureName);
    const feature = this.permissions.features.find((f) => f.name === featureName);
    if (feature) {
      feature.enabled = !feature.enabled;
    }
  };

  likePost = (postId: number) => {
    console.log("点赞文章", postId);
    const post = this.posts.find((p) => p.id === postId);
    console.log("this", this, post);
    if (post) {
      post.likes++;
    }
  };
}
