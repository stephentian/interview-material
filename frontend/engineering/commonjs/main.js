let a = require("./a");
let b = require("./b");
console.log("main.js: a.done = %j, b.done = %j", a.done, b.done);

/*
b.js: a.done = false
b.js执行完毕
a.js: b.done = true
a.js执行完毕
main.js: a.done = true, b.done = true
*/
