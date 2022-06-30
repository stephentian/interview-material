/**
 * @description: builder design pattern 生成器模式
 * @author: stephen
 * @date: 2022-06-29
 **/

class Dog {
  constructor() {
    this.kind = null;
    this.color = null;
  }
}

class dogBuilder {
  dog = {
    kind: null,
    color: null,
  };
  constructor() {
    this.dog = new Dog();
  }
  setKind(name) {
    this.dog.kind = name;
    return this;
  }
  setColor(color) {
    this.dog.color = color;
    return this;
  }
  build() {
    console.log("我的狗: ", this.dog);
    return this.dog;
  }
}

const myDog = new dogBuilder().setKind("哈士奇").setColor("white").build();
// 我的狗:  Dog {kind: '哈士奇', color: 'white'}
