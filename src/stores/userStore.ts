export class UserStore {
  name = "游客";
  age = 18;
  email = "";
  city = "";

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
}
