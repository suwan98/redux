# Redux Statement Library

## 리덕스란?

- `store`를 구성해 `store`를 통해 전역적으로 상태관리를 할 수 있게 된다

![Alt text](./docs/assest/what-redux.png)

## 리덕스의 데이터 플로우

![Alt text](./docs/assest/reduxt-data-flow.png)

### Action

- Action은 간단한 자바스크립트 객체
  - 여기에는 우리가 수행하는 작업의 유형을 지정하는 `type`속성이 존재
  - `Redux` 저장소에 일부 데이터를 보내는데 사용되는 `payload` 객체를 가질 선택적으로 가질 수 있다

### Reducer

- `Reducer`는 애플리케이션 상태 변경 사항을 결정하고 업데이트 된 상태를 반환하는 함수
- `Reducer`는 인수를 취하고 `store` 내부의 상태를 업데이트한다.

<br />
<br />

## 미들웨어 없이 카운터 만들기

- [미들웨어 없이 카운터 앱 만들기](./docs/counter.md)
