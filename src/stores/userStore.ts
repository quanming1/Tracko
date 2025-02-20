import { makeAutoObservable } from "mobx";

interface IAddress {
  province: string;
  city: string;
  detail: string;
}

interface IContact {
  email: string;
  phone: string;
  address: IAddress;
}

interface ISocialMedia {
  platform: string;
  username: string;
  isVerified: boolean;
}

interface IPreferences {
  theme: "light" | "dark";
  language: "zh" | "en";
  notification: {
    email: boolean;
    push: boolean;
    frequency: "daily" | "weekly" | "monthly";
  };
  display: {
    fontSize: number;
    colorMode: {
      primary: string;
      secondary: string;
    };
  };
}

export class UserStore {
  name = "游客";
  age = 18;

  // 深度嵌套的联系信息
  contact: IContact = {
    email: "",
    phone: "",
    address: {
      province: "",
      city: "",
      detail: "",
    },
  };

  // 社交媒体账号列表
  socialAccounts: ISocialMedia[] = [];

  // 深度嵌套的用户偏好设置
  preferences: IPreferences = {
    theme: "light",
    language: "zh",
    notification: {
      email: true,
      push: true,
      frequency: "daily",
    },
    display: {
      fontSize: 14,
      colorMode: {
        primary: "#000000",
        secondary: "#ffffff",
      },
    },
  };

  constructor() {
    makeAutoObservable(this);
  }

  // 基础信息设置
  setName = (name: string): void => {
    this.name = name;
  };

  setAge = (age: number): void => {
    this.age = age;
  };

  // 联系信息设置
  setContact = (contact: Partial<IContact>): void => {
    this.contact = { ...this.contact, ...contact };
  };

  setAddress = (address: Partial<IAddress>): void => {
    this.contact.address = { ...this.contact.address, ...address };
  };

  // 社交账号管理
  addSocialAccount = (account: ISocialMedia): void => {
    this.socialAccounts.push(account);
  };

  removeSocialAccount = (platform: string): void => {
    this.socialAccounts = this.socialAccounts.filter((account) => account.platform !== platform);
  };

  // 偏好设置相关方法
  setTheme = (theme: "light" | "dark"): void => {
    this.preferences.theme = theme;
  };

  setLanguage = (language: "zh" | "en"): void => {
    this.preferences.language = language;
  };

  setNotificationPreferences = (settings: Partial<IPreferences["notification"]>): void => {
    this.preferences.notification = {
      ...this.preferences.notification,
      ...settings,
    };
  };

  setDisplayPreferences = (settings: Partial<IPreferences["display"]>): void => {
    this.preferences.display = {
      ...this.preferences.display,
      ...settings,
    };
  };

  setColorMode = (colors: Partial<IPreferences["display"]["colorMode"]>): void => {
    this.preferences.display.colorMode = {
      ...this.preferences.display.colorMode,
      ...colors,
    };
  };
}
