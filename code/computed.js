/**
 * @description: computed
 * @author: stephen
 * @date: 2022-06-30
 **/

function reactive(obj) {
  const handler = {
    set: function (target, key, newValue, receiver) {
      console.log("设置数据，更新 value");
      Reflect.set(target, key, newValue, receiver);
    },
  };
  const objProxy = new Proxy(obj, handler);
  return objProxy;
}

const node = reactive({
  leftChildren: 1,
  // rightChildren: 0,
});

console.log(node.leftChildren, node.rightChildren); // 1 undefined

function computed(fn) {
  // const obj = {
  //   value: null,
  // };
  // const handler = {
  //   get: function (target, key, value) {
  //     console.log("获取 value");
  //     return fn();
  //   },
  // };
  // let result = new Proxy(obj, handler);
  const obj = {
    get value() {
      return fn();
    },
  };

  return obj;
}

const children = computed(
  () => node.leftChildren + (parseInt(node.rightChildren) || 0)
);
console.log(children.value); // 1

node.leftChildren = 10;
console.log(children.value); // 10

node.rightChildren = 2;
console.log(children.value); // 12
