// 아무 곳에서나 함수 열기, 함수 실행을 원하는 시점으로 미뤄서 실행하기

/** 객체와 key */
const obj = { " b b b ": 1, "🎉": "🤟" };
obj[" b b b "]; /*?*/
obj["🎉"]; /*?*/

const obj2 = { [true ? "a" : "b"]: 1}
obj2["a"]; /*?*/
obj2["b"]; /*?*/

/** delete */
// 자바스크립트에서는 기본 객체의 메서드나 프로퍼티도 삭제 가능
const obj3 = { a: 1, b: 2, c: 3 };
delete obj3.a;
obj3; /*?*/
delete obj3.b;
obj3 /*?*/
delete obj3['C'.toLowerCase()];
obj3 /*?*/

/** 괄호 없이 정의가 가능한(즉시 실행도 가능한) 다양한 상황 */
!function(a) {
  console.log(a);
}(1);

true && function(a) {
  console.log(a);
}(1);

1 ? function(a) {
  console.log(a);
}(1) : '';

888, function(a) {
  console.log(a);
}(1);

var b = function(a) {
  console.log(a);
}(1);

function f2() {}
f2(function(a) {
  console.log(a);
}(1));

new function() {
  console.log(1);
};

(function a(b) { 
  console.log(b); 
})(1);

const F = new function() {
  this.name = 'A';
  this.age = 20;
};
console.log(F);

/** 즉시 실행하며 this 할당하기 */
(function(a) {
  console.log(this, a);
}).call([1], 1);

var a = function(a) {
  console.log(this, a);
}.call([2], 1);

/** new Function이나 eval을 써도 될까? */
// 서버에서 클라이언트가 보낸 값을 이용해 new Function이나 eval을 사용하는 것이 아니라면
// 사실상 보안 문제라는 것은 있을 수 없다.
// 어디까지나 보안에 대한 과제는 클라이언트의 특정 요청에 대해 서버에서 응답을 줘도 될 것인지
// 안 될 것인지 잘 판단하는 데 달려 있다.

/** new Function */
// 자바스크립트로 HTML 템플릿 엔진을 만든다거나
// 기타 특정 상황에서는 new Function이 꼭 필요할 때가 있다.
// 그럴 때 로직을 잘 보완하면 해당 코드가 성능에 미칠 부정적인 영향을 얼마든지 최소화 할 수 있다.

/** new Function과 eval의 사용법 */
const e = eval('(function a(b) { return b * b }(10))');
e; /*?*/

const adder = new Function('a, b', 'return a + b');
adder(10, 90); /*?*/

// 간단 버전 문자열 화살표 함수와 new Function 성능
function L(str) {
  const splitted = str.split('=>');
  return new Function(splitted[0], `return (${splitted[1]})`);
}

L('a, b => a + b')(10, 11); /*?*/
L('n => n * 10')(10); /*?*/

// 일반적인 익명함수 선언과 비교해보면 약 300배 정도느리다.
// 하지만 map을 사용해 10,000번 정도 iteration이 돈다면
// 성능차이가 거의 나지 않는다.

const map = (f, coll) => {
  const _ = [];
  for (const [k, v] of coll.entries()) {
    _.push(f(k));
  }
  return _;
}

console.time('1');
var arr = Array(10000);
map(k => k + 1, arr);
console.timeEnd('1'); // 6 ~ 10 ms

console.time('2');
var arr = Array(10000);
map(L('k => k + 1'), arr);
console.timeEnd('2'); // 6 ~ 10 ms

// 10,000번 iteration이 돌지만 new Function은 한 번 만 실행된다.
// L 함수는 한 번만 실행되었고 한 번의 new Function으로 만들어진 함수를
// iteratee로 map에게 넘긴다.
// 그리고 map은 함수를 10,000번 실행한다.
// map 입장에서는 함수가 일반 자바스크립트 코드로 정의되었든
// new Function으로 정의되었든 그저 함수일 뿐이다.
// 전자나 후자나 똑같이 그냥 하나의 함수를 만 번 실행한 것이다.
// eval을 사용해도 동일하다. 성능차이는 거의 없다.

console.time('3');
var arr = Array(10000);
map(eval("L('k => k + 1')"), arr);
console.timeEnd('3');

eval("L('k => k + 1')")(10); /*?*/

// 하지만 다음과 같은 경우에는 메모이제이션을 활용하지 않으면 성능에 큰 차이가 난다.
// iteration이 돌 때마다 새로운 Function을 생성하는 경우이다.
console.time('4');
var arr = Array(10000);
map(k => (k => k * 2)(k), arr);
console.timeEnd('4');

console.time('5');
var arr = Array(10000);
map(k => (L('v => v * 2'))(k), arr);
console.timeEnd('5');

// 메모이제이션을 적용한 LM
const LM = str => {
  if (LM[str]) return LM[str]; // 이미 같은 str으로 만든 함수가 있다면 즉시 리턴
  const splitted = str.split('=>');
  return LM[str] = new Function(splitted[0], `return (${splitted[1]})`);
};

console.time('6');
var arr = Array(10000);
map(k => (LM('v => v * 2'))(k), arr);
console.timeEnd('6');

// LM은 이전에 들어왔던 것과 동일한 인자가 들어오면,
// 새롭게 함수를 생성하지 않고 원래 있던 함수를 리턴한다.
// 이전에 들어왔던 문자열과 동일한 문자열로 작성된 화살표 함수 표현식이 들어오면,
// 기존에 만들어 둔 함수를 활용한다.

/** Named Function */
// 함수를 값으로 다루면서 익명이 아닌 f()처럼 이름을 지은 함수가 Named Function이다.
// 재귀를 사용할 때 Named Function이 유용하게 사용될 수 있다.

var f1 = function() {
  console.log(f1);
}

f1();
// 위험 상황
var f2 = f1;
f1 = 'hi~~';
f1; // hi~~
f2(); // hi~~
// 함수 생성 이후 변경이 일어나면 더 이상 자기 자신을 참조하지 못하게 될 수 있다.
// 유명 함수는 함수가 값으로 사용되는 상황에서 자신을 참조하기 매우 편하다.
// 함수의 이름이 바뀌든 메서드 안에서 생성한 함수를 다시 참조하고 싶은 상황이든 어떤 상황에서든
// 상관없이 자기 자신을 정확히 참조할 수 있다.
var f1 = function f() {
  console.log(f);
}

f1();
var f2 = f1;
f1 = null;
f2(); // Function: f

// 유명함수식에서의 함수 이름은 내부 스코프에서만 참조 가능하고 외부에서는 그 이름을 참조할 수 없고
// 없애지도 못해서 매우 안전하다.
var hi = 1;
var hello = function hi() {
  console.log(hi);
}

hello(); // Function: hi
console.log(hi);
console.log(++hi);
hello();
console.log(hello.name == 'hi'); // true
var z1 = function z() {
  console.log(z, 1);
}

var z2 = function z() {
  console.log(z, 2);
}

console.log(z1.name == z2.name);
// z; // z is not defined

/** Named Function을 이용한 재귀 */
function flatten(arr) {
  return function recur(arr, new_arr) {
    arr.forEach(function(v) {
      Array.isArray(v)
        ? recur(v, new_arr)
        : new_arr.push(v);
    })
    return new_arr;
  }(arr, []);
}

flatten([1, [2], [3, 4, [5]]]); /*?*/

// 꼬리 재귀 최적화
// 환경에 따라 다르지만 대략 15,000번 이상 재귀가 일어나면
// stack over flow가 발생한다.
// 따라서 자바스크립트에서 얼마나 깊은 재귀가 일어날 것인지 유의하며 함수를 작성해야 한다.
// 자바스트립트의 실제 동작환경에서는 비동기 프로그래밍이 많이 쓰이고 비동기가 일어나면 스택이 초기화된다.
// 애초에 비동기 상황이었다면 스택이 초기화 될 것이므로 재귀 사용을 피할 이유가 없다.

// 자바스크립트에서 함수는 '어떻게 선언했느냐'와 '어떻게 실행했느냐' 모두 중요하다
// 어떻게 선언했느냐는 클로저와 스코프 관련된 부분들을 결정하고
// 어떻게 실행했느냐는 this와 arguments를 결정한다

function test2(a, b) {
  b = 10;
  console.log(arguments);
  return arguments;
}

test2(1, 2); /*?*/

function test3(a, b) {
  arguments[1] = 10;
  return b;
}

test3(1, 2); /*?*/ // 10

/** call, apply 다시 보기 */
function test(a, b, c) {
  return a + b + c;
}
test.call(undefined, 1, 2, 3); /*?*/
test.call(null, 1, 2, 3); /*?*/
test.call(void 0, 1, 2, 3); /*?*/

var o1 = { name: 'obj1' };
test.call(o1, 1, 2, 3); /*?*/

// apply
test.apply(null, [1, 2, 3]); /*?*/
test.apply(null, { 0: 1, 1: 2, 2: 3, length: 3}); /*?*/
(function () {
  test.apply(1000, arguments); /*?*/
})(3, 2, 1);

// call의 실용적 사례
// Array.prototype.slice의 경우 키를 숫자로 갖고 length를 갖는 객체이기만 하면
// Array가 아닌 값이어도 call을 통해 Array.prototype.slice를 동작시킬 수 있다.
// toArray와 rest 함수는 구현을 Native Helper에게 위임하여 짧은 코드로 성능이
// 좋은 유틸 함수를 만들었다.
var slice = Array.prototype.slice;
function toArray(data) {
  return slice.call(data);
}
function rest(data, n) {
  return slice.call(data, n || 1);
}
var arr1 = toArray({ 0: 1, 1: 2, length: 2 }); /*?*/
arr1.push(3); /*?*/
arr1; /*?*/
rest([1, 2, 3]); /*?*/
rest([1, 2, 3], 2); /*?*/

/** if else || && 삼항연산자 다시 보기 */
// if의 괄호
// 괄호에서는 기본적으로 boolean 값을 받으며, truthy, falsy값을 받는다. 괄호 안에서 코드를
// 실행하는 것도 가능하다.
// if의 괄호에서 할 수 없는 일
// - 지역 변수와 지역 함수 선언 (표현식만 사용가능)
// - 비동기 프로그래밍
// (async await)를 사용하면 if의 () {}에서 비동기 코드를 동기적으로 동작 시킬 수 있다.

// if (var a = 0) console.log(a); // error
var a;
if (a = 5) console.log(a);
if (a = 0) console.log(1);
else console.log(a);
if (!(a = false)) console.log(a);
if (a = 5 - 5);
else console.log(a);

function add(a, b) {
  return a + b;
}

if (add(1, 2)) console.log('hi');

var a;
if (a = add(1, 2)) console.log(a);
if (function() { return true; }()) console.log('hi');

// || &&
var a = true;
var b = false;

var v1 = a || b;
console.log(v1);

var v2 = b || a;
console.log(v2);

var v3 = a && b;
console.log(v3);

var v4 = b && a;
console.log(v3);

var a = "hi";
var b = "";

// a가 긍정적인 값이면 || 이후를 확인하지 않아 a의 값이 v1에 담긴다.
var v1 = a || b;
console.log(v1);

// b가 부정적이어서 a를 확인했고 a의 값이 담겼다.
var v2 = b || a;
console.log(v2);

// a가 긍정적인 값이므로 && 이후를 확인하게 되고 b값이 담긴다.
var v3 = a && b;
console.log(v3);

// b가 부정적인 값이어서 && 이후를 확인할 필요 없이 b 값이 담긴다.
var v4 = b && a;
console.log(v4);

// 삼항 연산자
