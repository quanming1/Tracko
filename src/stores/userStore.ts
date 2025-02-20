import { makeAutoObservable } from "mobx";

export class UserStore {
  name = "游客";
  age = 18;
  preferences = {
    theme: "light" as "light" | "dark",
    language: "zh",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setName = (name: string): void => {
    this.name = name;
  };

  setAge = (age: number): void => {
    this.age = age;
  };

  setTheme = (theme: "light" | "dark"): void => {
    this.preferences.theme = theme;
  };

  setLanguage = (language: string): void => {
    this.preferences.language = language;
  };
}
