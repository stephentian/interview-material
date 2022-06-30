/**
 * @description: 装饰器模式
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

function happyDogDecorator(Animal) {
  function happy() {
    console.log("摇尾巴！");
    new Dog().speak();
  }
  Animal.prototype.happy = happy;
  return new Animal();
}

let goodDog = happyDogDecorator(Dog);
goodDog.happy();
// 摇尾巴！
// 汪汪汪！
