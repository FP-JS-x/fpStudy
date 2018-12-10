// 3.1 map
// 3.2 filter
// 3.3 find
// 3.4 findIndex
// 3.5 bValue
// 3.5.2 currying
// 3.5.3 bValues
// 3.6 bmatch (object, match, bmatch)
// 3.7 some, every만들기

// 책 다시보며 logLength는 그다지 필요성???
// bValue => currying공부 할 것 !
//
// bValues => 객체 값을 가져온다

const users = [
  { id: 1, name: "ID", age: 32 },
  { id: 2, name: "HA", age: 25 },
  { id: 3, name: "BJ", age: 32 },
  { id: 4, name: "PJ", age: 28 },
  { id: 5, name: "JE", age: 27 },
  { id: 6, name: "JM", age: 32 },
  { id: 7, name: "HI", age: 24 }
];

const map = (list, mapper) => {
  const newList = [];
  for (let item of list) {
    newList.push(mapper(item));
  }
  return newList;
};

//test
console.log(map([1, 2, 3, 5], a => a + 1)); // 2,3,4,6

const filter = (list, predicate) => {
  const newList = [];
  for (let item of list) {
    if (predicate(item)) newList.push(item);
  }
  return newList;
};
//test
console.log(filter([2, 3, 5, 7, 8], v => v % 2 === 0)); // 2, 8

const bValue = key => obj => obj[key];
const bValues = key => list => map(list, v => v[key]);
const userName = bValue("name");
const userNames = bValues("name");
console.log(userName(users[0]));
console.log(userNames(users));

// find의 필요성
// filter로는 못함
// 1. 한명만 딱 찾고 싶음
// 2. 중간에 return 되게 효율적으로 찾고 싶음

const find = (list, predicate) => {
  for (let item of list) {
    if (predicate(item)) return item;
  }
  return null;
};

// const bmatch = (key, val) => obj => obj[key] === val;

console.log(find(users, v => v.name === "BJ"));

// console.log(find(users, bmatch("name", "BJ")));
// console.log(map(users, bmatch("age", 32)));

const object = (key, val) => {
  const obj = {};
  obj[key] = val;
  return obj;
};

const match = (obj, obj2) => {
  for (let key in obj2) {
    if (obj[key] !== obj2[key]) return false;
  }
  return true;
};

// bmatch는 하나의 key에 대한 value만 비교할 수 있다.
// function bmatch(obj2, val) {
//   if (arguments.length === 2) obj2 = object(obj2, val);
//   return function(obj) {
//     return match(obj, obj2);
//   };
// }

const bmatch = (...args) => {
  if (args.length === 2) args[0] = object(args[0], args[1]);
  return obj => match(obj, args[0]);
};

console.log(find(users, bmatch({ name: "JM", age: 32 })));

console.log(find(users, bmatch("name", "BJ")));

const findIndex = (list, predict) => {
  for (const i of list.keys()) {
    if (predict(list[i])) return i;
  }
  return -1;
};

console.log(findIndex(users, bmatch("name", "BJ")));

const identity = v => v;
console.log(filter([true, 0, 10, "a", false, null], identity));

const falsy = v => !v;
const truthy = v => !!v;

// some과 Every만들기

const some = (list, checker) => {
  return !!find(list, checker);
};

const every = (list, checker) => {
  for (const i of list.keys()) {
    if (!checker(list[i].i, list)) return false;
  }
  return true;
};

// 책에서는 이렇게 햇는데
// 이렇게 하면 루프를 다 도니까 위에 것이 더 적합하지 않나 싶다
const every2 = (list, checker) => {
  return filter(list, checker).length === list.length;
};

console.log(some(users, v => v.name === "BJ"));
console.log(some(users, v => v.name === "Dali"));

// 1.3.6 지적한 부분을 개선하려고 한다

const not = v => !v;
const beq = a => b => a === b;

const isAllTruthy = list => every3(list, identity);
const hasTruthy = list => some(list, identity);

console.log(hasTruthy([0, null, 2]));

console.log(hasTruthy([0, null, false]));

const positive = list => find(list, identity);
const negativeIdx = list => findIndex(list, not);

console.log(positive([0, null, 2]));
console.log(negativeIdx([0, null, 2]));

const _some = list => !!positive(list);

const _some = (list, checker) => list => not(not(positive(list)));

const _some = function(list) {
  return not(not(positive(list)));
};

// not not???
// !!
console.log(_some([0, null, false]));

const _every = (list, checker) => beq(-1)(negativeIdx(list, checker));

console.log("every", _every([1, 3, 2], identity));

// const _compose = ()=>{
//   const args = arguments;
// }

// compose는 내일 다시 공부해보기
// 왜 동작 안할까?
// function _compose() {
//   const args = arguments;
//   const start = arguments.length - 1;
//   return function() {
//     let i = start;
//     let result = args[start].apply(this, arguments);
//     return result;
//   };
// }

// const greet = function(name) {
//   return `hi ${name}`;
// };

// const exclaim = function(statement) {
//   return statement.toUpperCase() + "!";
// };

// const welcome = _compose(greet, exclaim);
// console.log(welcome("dali"));

// 연산자대신 함수
// for if대신 고차함수와 보조함수로

// arguments와 bind, call, apply를 잘 알고 있어야 다음 단계로 !!!

// 일급함수 함수를 값처럼 다룰 수 있다
// 고로

// 메소드에 인자 파라미터
// 변수에 담거나 return 값으로 다룰 수 있다 !

// 런타임에서도 선언 가능
// 익명으로 선언가능
// 익명으로 선언한 함수도 함수나 메서드의 인자로 넘길 수 있다

function f1() {
  var a = typeof f1 == "function" ? f1 : function() {};
}
