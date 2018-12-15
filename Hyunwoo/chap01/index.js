const assert = require('assert');
log = console.log;

const users = [
  { id: 1, name: 'ID', age: 32 },
  { id: 2, name: 'HA', age: 12 },
  { id: 3, name: 'BJ', age: 22 },
  { id: 4, name: 'PJ', age: 42 },
];

/**
 * filter 1
 * new_list.push 실행 여부를 predicate 함수에게 위임
 * filter 함수는 predicate 내부 로직을 모른다
 */
function filter1(list, predicate) {
  // 이전 값(list)의 상태를 변경하지 않고
  // 새로운 값(new_list)를 만드는 식으로 값을 다루는 것은
  // FP의 중요한 컨셉중 하나이다(immutability)
  const new_list = [];
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i])) new_list.push(list[i]);
  }
  return new_list;
}

assert.deepEqual(filter1(users, u => u.age > 20), [users[0], users[2], users[3]]);

/** filter 2 */
const filter2 = (fn, coll, _coll = []) => {
  for (const each of coll) {
    if (fn(each)) _coll.push(each);
  }
  return _coll;
};

assert.deepEqual(filter2(u => u.age > 20, users), [users[0], users[2], users[3]]);

// 중복을 제거하고 의도를 드러냄
/*
  var ages = [];
  for (var i = 0, len = users_under_30.length; i < len; i++) {
    ages.push(users_under_30[i].age);
  }
*/
/** map 1 */

function map1(list, iteratee) {
  const new_list = [];
  for (let i = 0, len = list.length; i < len; i++) {
    new_list.push(iteratee(list[i]));
  }
  return new_list;
}

assert.deepEqual(map1(users, u => u.age), [32, 12, 22, 42]);

/** map 2 */
const map2 = (fn, coll, _coll = []) => {
  for (const each of coll) {
    _coll.push(fn(each));
  }
  return _coll;
};

assert.deepEqual(map2(u => u.age, users), [32, 12, 22, 42]);

// 실행 결과로 바로 실행
const names_over_30 = map2(u => u.name, filter2(u => u.age > 30, users));

assert.deepEqual(names_over_30, ['ID', 'PJ']);

// bvalue 이용해서 코드 줄이기
/** bvalue */
const bvalue = key => obj => obj[key]; // bind

// const names_over_20 = map2(u => u.name, filter2(u => u.age > 20, users));
const names_over_20 = map2(bvalue('name'), filter2(u => u.age > 20, users));
const ids_over_20 = map2(bvalue('id'), filter2(u => u.age > 20, users));

assert.deepEqual(names_over_20, ['ID', 'BJ', 'PJ']);
assert.deepEqual(ids_over_20, [1, 3, 4]);

/** findById */
const findById = (id, coll) => {
  for (const each of coll) {
    if (bvalue('id')(each) == id) return each;
  }
};

assert.deepEqual(findById(1, users), { id: 1, name: 'ID', age: 32 });
assert.deepEqual(findById(99, users), undefined);

/** findBy */
const findBy = type => (value, coll) => {
  for (const each of coll) {
    if (bvalue(type)(each) == value) return each;
  }
};

const findByName = findBy('name');
const findByAge = findBy('age');

assert.deepEqual(findByName('BJ', users), { id: 3, name: 'BJ', age: 22 });
assert.deepEqual(findByAge(22, users), { id: 3, name: 'BJ', age: 22 });

// findBy의 단점
// * key가 아닌 메서드를 통해 값을 얻어야 할 때
// * 두 가지 이상의 조건이 필요할 때
// * === 이 아닌 다른 조건으로 찾고자 할 때

// 값에서 함수로
// 함수형 자바스크립트는 다형성이 높은 기법을 많이 사용하며 이러한 기법은 실용적이다.
// 들어온 데이터의 특성은 보조 함수가 대응해주기 때문에 find 함수는 데이터의 특성에서 완전히 분리될 수 있다.
// 이러한 방식은 다형성을 높이며 동시에 안정성도 높인다.
const find = (fn, coll) => {
  for (const each of coll) {
    if (fn(each)) return each;
  }
};

assert.deepEqual(find(u => u.age == 22, users), { id: 3, name: 'BJ', age: 22 });

// 함수를 만드는 함수와 find, filter 조합하기
const bmatch1 = (key, val) => obj => obj[key] == val;

assert.deepEqual(find(bmatch1('age', 22), users), { id: 3, name: 'BJ', age: 22 });
assert.deepEqual(filter2(bmatch1('name', 'BJ'), users), [{ id: 3, name: 'BJ', age: 22 }]);

// 여러개의 key에 해당하는 value들을 비교
// 문제 1: 1.3, 1.4,
// 문제 2: 2장 1.2 README 정리

// bmatch1은 하나의 key에 대한 value만 비교 가능
// 여러 개의 key에 해당하는 value들을 비교하는 함수 만들기
// function object(key, val) {
//   const obj = {};
//   obj[key] = val;
//   return obj;
// }
const object = (key, val, _obj = {}) => ((_obj[key] = val), _obj);

// function match(obj, obj2) {
//   for (const key in obj2) {
//     if (obj[key] !== obj2[key]) return false;
//   }
//   return true;
// }
const match = (obj, obj2) => {
  for (const key in obj2) {
    if (obj[key] != obj2[key]) return false;
  }
  return true;
};

assert.equal(match({ a: 'a', b: 'b', c: 'c' }, { a: 'a', b: 'b', c: 'c' }), true);

// function bmatch(obj2, val) {
//   if (arguments.length == 2) {
//     obj2 = object(obj2, val);
//   }
//   return function(obj) {
//     return match(obj, obj2);
//   };
// }
const bmatch = (obj, ...v) =>
  !!v.length ? ((obj = object(obj, v)), _obj => match(_obj, obj)) : _obj => match(_obj, obj);

assert.deepEqual(match(find(bmatch('id', 3), users), find(bmatch('name', 'BJ'), users)), true);
assert.deepEqual(find(bmatch({ name: 'HA', age: 12 }), users), { id: 2, name: 'HA', age: 12 });

// findIndex
const findKey = (findIndex = (f, coll) => {
  for (const [k, v] of Object.entries(coll)) {
    if (f(v)) return k;
  }
  return;
});

assert.equal(findIndex(a => a == 3, [1, 2, 3]), 2);
assert.equal(findKey(_ => _ == 'bear', { a: 'apple', b: 'bear', c: 'cat' }), 'b');

// map, filter, find, findIndex, bvalue, bmatch 같은 함수들은 모두 고차 함수이다.
// 보통 고차 함수는 함수를 인자로 받아 필요한 때에 실행하거나 클로저를 만들어 리턴한다.

// 고차함수를 Underscore.js와 비슷하게 고쳐보기
const _ = {};

_.map = (f, coll, _coll = []) => {
  for (const [k, v] of Object.entries(coll)) {
    _coll.push(f(v, k, coll));
  }
  return _coll;
};

assert.deepEqual(_.map((val, idx) => ({ val, idx }), [1, 2, 3]), [
  { val: 1, idx: '0' },
  { val: 2, idx: '1' },
  { val: 3, idx: '2' },
]);
assert.deepEqual(_.map(_ => _ * 2, [1, 2, 3]), [2, 4, 6]);

_.filter = (f, coll, _coll = []) => {
  for (const [k, v] of Object.entries(coll)) {
    if (f(v, k, coll)) _coll.push(v);
  }
  return _coll;
};

assert.deepEqual(_.filter((val, idx) => idx > 1, [1, 2, 3]), [3]);

_.find = (f, coll, _coll = []) => {
  for (const [k, v] of Object.entries(coll)) {
    if (f(v, k, coll)) return v;
  }
};

assert.equal(_.find((val, idx) => idx == 1, [1, 2, 3]), 2);

_.findIndex = (f, coll, _coll = []) => {
  for (const [k, v] of Object.entries(coll)) {
    if (f(v, k, coll)) return k;
  }
};

assert.equal(_.findIndex((val, idx) => val == 1, [1, 2, 3]), 0);

// identity
_.identity = a => a;

assert.equal(_.identity(10), 10);
assert.deepEqual(_.filter(_.identity, [true, 0, 1, 2, 0, undefined, null]), [true, 1, 2]);

_.falsy = v => !v;
_.truthy = v => !!v;

// some : 
// 배열에 들어 있는 값 중 하나라도 긍정적인 값이 있으면 true를
// 하나도 없다면 false를 반환한다
_.some = coll => !!_.find(_.identity, coll);

// every :
// every는 모두 긍정적인 값이어야 true를 리턴한다.
_.every = coll => _.filter(_.identity, coll).length == coll.length;
assert.equal(_.every([1, 1, 1]), true);
assert.equal(_.every([1, 0, 1]), false);

// _.some, _.every는 if나 predicate와 함께 사용할 때 매우 유용하다
// _.every는 조금 아쉬운 점이 있다.
// filter를 사용했기 떄문에 항상 루프를 끝까지 돌게 된다.
// 작은 함수 두 개를 더 만들어 로직을 개선할 수 있다.
// 연산자 대신 함수로
const not = v => !v;
const beq = a => b => a == b

_.every2 = coll => beq(undefined)(_.findIndex(not, coll));
assert.equal(_.every2([1, 0, 1]), false);
assert.equal(_.every2([1, 1, 1]), true);

// 함수 합성
// _.compose는 오른쪽의 함수의 결과를 바로 왼쪽에게 전달한다.
_.compose = function() {
  const args = arguments;
  let start = args.length - 1;
  return function() {
    let i = start;
    let result = args[start].apply(this, arguments);
    while(i--) {
      result = args[i].call(this, result);
    }
    return result;
  }
}

// _.some = coll => !!_.find(_.identity, coll);
const positive = coll => _.find(_.identity, coll);
const negative = coll =>  _.findIndex(not, coll);
const some = _.compose(not, not, positive);
const every = _.compose(beq(undefined), negative);

assert.equal(some([1, 0, false]), true);
assert.equal(every([1, 0, false]), false);
assert.equal(every([1, 2, 3]), true);

// 값 대신 함수로, for과 if 대신 고차 함수와 보조 함수로, 연산자 대신 함수로,
// 함수 합성 등 함수적 기법들을 사용하면 코드도 간결해지고 함수명을 통해
// 로직을 더 명확히 전달할 수 있어 읽기 좋은 코드가 된다.
