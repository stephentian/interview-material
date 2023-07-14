// a.mjs
import b from './b.mjs';
console.log(b.count);    // 1
b.add();
console.log(b.count);    // 1
console.log(b.get());    // 2