const assert = require('assert');

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
}

assert.deepEqual(find(u => u.age == 22, users), { id: 3, name: 'BJ', age: 22 });

// 함수를 만드는 함수와 find, filter 조합하기
const bmatch1 = (key, val) => obj => obj[key] == val;

assert.deepEqual(find(bmatch1('age', 22), users), { id: 3, name: 'BJ', age: 22 });
assert.deepEqual(filter2(bmatch1('name', 'BJ'), users), [{ id: 3, name: 'BJ', age: 22 }]);

// 여러개의 key에 해당하는 value들을 비교
