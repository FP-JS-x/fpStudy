함수형 프로그래밍
* 부수효과를 최대한 멀리하고 조합성을 강조
  * 오류가 줄어든다 -> 프로그램의 안정성 높아짐
  * 모듈화 수준이 높아진다 -> 생산성이 높아짐

함수를 값으로 다루기
```js
function addMaker(a) {
  // closure 익명함수 - 상위 스코프의 a를 참조, a는 불변하며 상수로 쓰인다
  return function(b) {
    return a + b;
  }
}
const add5 = addMaker(5);
add5(3); // 8
```
* 함수는 값을 리턴할 수 있다
* 함수는 값이 될 수 있다
* 함수형 프로그래밍에서는 '항상 동일하게 동작하는 함수'를 만들고 보조 함수를 조합하는 식으로 로직을 완성한다.
* OOP가 약속된 이름의 메서드를 대신 실행해주는 식으로 외부 객체에게 위임을 한다면, 함수형 프로그래밍은 보조함수를 통해 완전히 위임하는 방식을 취한다. 이는 더 높은 다형성과 안정성을 보장한다.
