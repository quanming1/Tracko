import React from "react";
import { useStore } from "../../stores/center";
import styles from "./index.module.scss";

// 使用 useStore 的组件会响应所有 store 的变化
const StoreDisplay: React.FC = () => {
  const { counterStore, userStore } = useStore();

  const handleAddSocialAccount = () => {
    userStore.addSocialAccount({
      platform: `平台${Math.floor(Math.random() * 100)}`,
      username: `用户${Math.floor(Math.random() * 100)}`,
      isVerified: Math.random() > 0.5,
    });
  };

  const handleUpdateContact = () => {
    userStore.setContact({
      email: `user${Math.floor(Math.random() * 100)}@example.com`,
      phone: `1380013${Math.floor(Math.random() * 10000)}`,
    });
  };

  const handleUpdateAddress = () => {
    userStore.setAddress({
      province: ["广东", "北京", "上海", "四川"][Math.floor(Math.random() * 4)],
      city: ["深圳", "广州", "成都", "杭州"][Math.floor(Math.random() * 4)],
      detail: `示例街道${Math.floor(Math.random() * 100)}号`,
    });
  };

  return (
    <div className={styles["store-card"]}>
      <h3>Store 监听</h3>
      <div>
        <h4>Counter Store:</h4>
        <p>计数: {counterStore.count}</p>
        <p>操作次数: {counterStore.operationCount}</p>
        <div className={styles["button-group"]}>
          <button onClick={counterStore.increment}>增加</button>
          <button onClick={counterStore.decrement}>减少</button>
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h4>User Store:</h4>
        {/* 基础信息 */}
        <div className={styles["section"]}>
          <h5>基础信息</h5>
          <p>姓名: {userStore.name}</p>
          <p>年龄: {userStore.age}</p>
          <div className={styles["button-group"]}>
            <button onClick={() => userStore.setName("用户" + Math.floor(Math.random() * 100))}>
              随机名字
            </button>
            <button onClick={() => userStore.setAge(Math.floor(Math.random() * 50 + 18))}>
              随机年龄
            </button>
          </div>
        </div>

        {/* 联系信息 */}
        <div className={styles["section"]}>
          <h5>联系信息</h5>
          <p>邮箱: {userStore.contact.email}</p>
          <p>电话: {userStore.contact.phone}</p>
          <p>
            地址: {userStore.contact.address.province} {userStore.contact.address.city}{" "}
            {userStore.contact.address.detail}
          </p>
          <div className={styles["button-group"]}>
            <button onClick={handleUpdateContact}>更新联系方式</button>
            <button onClick={handleUpdateAddress}>更新地址</button>
          </div>
        </div>

        {/* 社交账号 */}
        <div className={styles["section"]}>
          <h5>社交账号</h5>
          {userStore.socialAccounts.map((account, index) => (
            <div key={index} style={{ marginBottom: "0.5rem" }}>
              <p>平台: {account.platform}</p>
              <p>用户名: {account.username}</p>
              <p>已认证: {account.isVerified ? "是" : "否"}</p>
            </div>
          ))}
          <div className={styles["button-group"]}>
            <button onClick={handleAddSocialAccount}>添加社交账号</button>
            {userStore.socialAccounts.length > 0 && (
              <button
                onClick={() => userStore.removeSocialAccount(userStore.socialAccounts[0].platform)}
              >
                删除第一个账号
              </button>
            )}
          </div>
        </div>

        {/* 偏好设置 */}
        <div className={styles["section"]}>
          <h5>偏好设置</h5>
          <p>主题: {userStore.preferences.theme}</p>
          <p>语言: {userStore.preferences.language}</p>
          <p>字体大小: {userStore.preferences.display.fontSize}</p>
          <p>主题色: {userStore.preferences.display.colorMode.primary}</p>
          <div className={styles["button-group"]}>
            <button
              onClick={() =>
                userStore.setTheme(userStore.preferences.theme === "light" ? "dark" : "light")
              }
            >
              切换主题
            </button>
            <button
              onClick={() =>
                userStore.setLanguage(userStore.preferences.language === "zh" ? "en" : "zh")
              }
            >
              切换语言
            </button>
            <button
              onClick={() =>
                userStore.setDisplayPreferences({ fontSize: Math.floor(Math.random() * 10) + 12 })
              }
            >
              随机字体大小
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 主组件
const StoreUpdateDemo: React.FC = () => {
  return (
    <div className={styles["test-page"]}>
      <div className={styles["outter"]}>
        <h1>Store 更新监听演示</h1>
        <div className={styles["cards-container"]}>
          <StoreDisplay />
        </div>
      </div>
    </div>
  );
};

export default StoreUpdateDemo;
