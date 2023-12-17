exports.done = false;
let b = require("./b");
console.log("a.js: b.done = %j", b.done); // true
exports.done = true;
console.log("a.js执行完毕");
