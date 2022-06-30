/**
 * @description: Adapter 适配器模式
 * @author: stephen
 * @date: 2022-06-30
 **/

class Dog {
  constructor() {
    this.name = "dog";
  }
  speak() {
    console.log("汪汪汪！");
  }
}

class Cat {
  constructor() {
    this.name = "cat";
  }
  speak() {
    console.log("喵喵喵！");
  }
}

function dogAdapter(Animal) {
  function speak() {
    return new Dog().speak();
  }
  Animal.prototype.speak = speak;
  return new Animal();
}

let catToDog = dogAdapter(Cat);
catToDog.speak(); // 汪汪汪！
