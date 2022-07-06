exports.done = false;
let a = require("./a"); // a.js停止
console.log("b.js: a.done = %j", a.done); // false
exports.done = true;
console.log("b.js执行完毕");
