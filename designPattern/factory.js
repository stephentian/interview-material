/**
 * @description: 工厂模式
 * @author: stephen
 * @date: 2022-06-29
 **/

// 比如一个动物工厂

class Dog {
  constructor(config) {
    this.name = "dog";
    this.config = config;
  }
  speak() {
    console.log("汪汪汪！");
  }
}

class Cat {
  constructor(config) {
    this.name = "cat";
    this.config = config;
  }
  speak() {
    console.log("喵喵喵！");
  }
}

function animalFactory(type, config = {}) {
  switch (type) {
    case "dog":
      return new Dog(config);
      break;
    case "cat":
      return new Cat(config);
      break;
    default:
      throw new Error("没有该类型动物!");
      break;
  }
}

// 创建一只狗
let dog = animalFactory("dog");
dog.speak(); // 汪汪汪！
