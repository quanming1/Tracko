import React, { useCallback } from "react";
import { useStore } from "../../stores/center";
import styles from "./index.module.scss";

const BasicInfoSection: React.FC = () => {
  const basicInfo = useStore(
    useCallback(
      (stores) => ({
        name: stores.userStore.name,
        age: stores.userStore.age,
      }),
      [],
    ),
  );

  console.log("BasicInfo 部分更新");

  return (
    <div className={styles["section"]}>
      <h4>基础信息</h4>
      <p>姓名: {basicInfo.name}</p>
      <p>年龄: {basicInfo.age}</p>
    </div>
  );
};

const ThemeSection: React.FC = () => {
  const theme = useStore(
    useCallback(
      (stores) => ({
        theme: stores.userStore.preferences.theme,
        fontSize: stores.userStore.preferences.display.fontSize,
      }),
      [],
    ),
  );

  console.log("Theme 部分更新");

  return (
    <div className={styles["section"]}>
      <h4>主题设置</h4>
      <p>主题: {theme.theme}</p>
      <p>字体大小: {theme.fontSize}</p>
    </div>
  );
};

const ContactSection: React.FC = () => {
  const contact = useStore(
    useCallback(
      (stores) => ({
        email: stores.userStore.contact.email,
        phone: stores.userStore.contact.phone,
      }),
      [],
    ),
  );

  console.log("Contact 部分更新");

  return (
    <div className={styles["section"]}>
      <h4>联系方式</h4>
      <p>邮箱: {contact.email}</p>
      <p>电话: {contact.phone}</p>
    </div>
  );
};

const UserInfoDisplay: React.FC = () => {
  return (
    <div className={styles["store-card"]}>
      <h3>用户信息 (分组监听)</h3>
      <BasicInfoSection />
      <ThemeSection />
      <ContactSection />
    </div>
  );
};

// 控制面板
const ControlPanel: React.FC = () => {
  const { userStore } = useStore();

  return (
    <div className={styles["store-card"]}>
      <h3>控制面板</h3>
      <div className={styles["button-group"]}>
        <button onClick={() => userStore.setName("用户" + Math.floor(Math.random() * 100))}>
          修改用户名
        </button>
        <button onClick={() => userStore.setAge(Math.floor(Math.random() * 50 + 18))}>
          修改年龄
        </button>
        <button
          onClick={() =>
            userStore.setDisplayPreferences({ fontSize: Math.floor(Math.random() * 10) + 12 })
          }
        >
          修改字体大小
        </button>
        <button
          onClick={() =>
            userStore.setContact({
              email: `user${Math.floor(Math.random() * 100)}@example.com`,
              phone: `1380013${Math.floor(Math.random() * 10000)}`,
            })
          }
        >
          修改联系方式
        </button>
      </div>
    </div>
  );
};

// 主组件
const StoreUpdateDemo: React.FC = () => {
  return (
    <div className={styles["test-page"]}>
      <div className={styles["outter"]}>
        <h1>Store 精确监听演示</h1>
        <p className={styles["description"]}>不同部分的数据更新只会触发对应组件的重新渲染</p>
        <div className={styles["cards-container"]}>
          <ControlPanel />
          <UserInfoDisplay />
        </div>
      </div>
    </div>
  );
};

export default StoreUpdateDemo;
