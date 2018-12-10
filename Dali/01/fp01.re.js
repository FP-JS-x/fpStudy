// 3.1 map [O]
// 3.2 filter [O]
// 3.3 find [O]
// 3.4 findIndex [O]
// 3.5 bValue [O]
// 3.5.2 currying
// 3.5.3 bValues [O]
// 3.6 bmatch (object, match, bmatch) [O]
// 3.7 some, every만들기 []

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
  for (let i of list.keys()) {
    newList.push(mapper(list[i], i, list));
  }
  return newList;
};

console.log(map([1, 2, 3, 5], a => a + 1)); // 2,3,4,6
console.log(map([1, 2, 3, 5], (v, i) => i + 1));

const filter = (list, predicate) => {
  const newList = [];
  for (let i of list.keys()) {
    if (predicate(list[i], i, list)) newList.push(list[i]);
  }
  return newList;
};

console.log(filter([2, 3, 5, 7, 8], v => v % 2 === 0)); // 2, 8

const find = (list, predicate) => {
  for (let i of list.keys()) {
    if (predicate(list[i], i, list)) return list[i];
  }
  return null;
};

const findIndex = (list, predicate) => {
  for (let i of list.keys()) {
    if (predicate(list[i], i, list)) return i;
  }
  return -1;
};

console.log(find(users, v => v.name === "BJ"));

console.log(findIndex(users, v => v.name === "Dali"));

const object = (key, val) => {
  const newObj = {};
  newObj[key] = val;
  return newObj;
};

const match = (obj, obj2) => {
  for (let key in ojb2) {
    if (obj[key] !== obj2[key]) return false;
  }
  return true;
};

const bValue = key => obj => obj[key];
const bValues = key => list => map(list, v => v[key]);

console.log(bValue);
// obj, match를 통해서 bMatch

function bmatch(ojb2, val) {
  if (argument.length === 2) ojb2 = object(obj2, val);
  return function(obj) {
    match(obj, obj2);
  };
}

const some = (list, checker) => {
  for (let i of list.keys()) {
    if (checker(list[i], i, list)) return true;
  }
  return false;
};

const every = (list, checker) => {
  for (let i of list.keys()) {
    if (!checker(list[i], i, list)) return false;
  }
  return true;
};

// 책에서는 함수를 잘게 쪼개서 표현했지만 아직 이정도에서는
// 저렇게 표현하는 것이 익숙하고 편하다

// 잘
//.. bMatch랑
// bValues
// currying다음에 다시 만들어 보기
// 안 쓰는 fn이다 보니까 뭔가 낯설고 외워서 만든 느낌이 강하다
