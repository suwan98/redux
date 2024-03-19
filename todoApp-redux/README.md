# Pure Redux로 Todolist 만들기

## 0. 필요한 패키지 설치

- Redux와 React-Redux 패키지를 설치합니다.

```bash
pnpm i -D redux react-redux

```

## 1. 기본 스토어 구성하기

**스토어는 프로젝트 내 단일 스토어로 구성하는것이 Redux 팀에서 정한 규칙입니다.**

- redux의 `createStore`는 인자로 실직적인 작업을 수행하는 리듀서 함수를 필요로 합니다.

  - 이에 대한 리듀서함수는 개발자가 직접적으로 구현해야합니다.

- 일반적으로 `combineReducer` 함수를 통해 여러 리듀서를 관리하지만 작은 투두앱을 목표로하며 하나의 리듀서만을 인자로 받고 store를 내보냅니다.

```tsx
/* store/store.ts */
import {createStore} from "redux";

const todoReducer = () => {};

const store = createStore(todoReducer);

export default store;
```

## 2. 컴포넌트 최상위에 Provider 전달하기

**리액트에서 리덕스를 사용하기 위해선 생성한 스토어를 애플리케이션 모든 컴포넌트가 전역적으로 접근할 수 있게 해야합니다.**

- 이때 `react-redux`의 `Provider` 컴포넌트를 사용하가ㅔ 되는데, `Provider` 컴포넌트는 리액트 컴포넌트 트리 내 작성한 스토어를 전역적으로 제공하는 역할을 하게 됩니다.
  - 최종적으로 어느 컴포넌트에서든지 스토어에 접근해 상태를 조회하거나 액션을 디스패치할 수 있습니다.

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {Provider} from "react-redux";
import store from "./store/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

## 3. store Reducer 구성하기

- 기존 기본 함수만 정의해뒀던 reducer에 대해 직접적으로 구현할 단계입니다.

  - 여기서 reducer는 순수함수여야한다는 원칙에 따라, 객체에 대해 직접적인 변경 대신 객체를 복사 해 변경하고자 하는 상태의 복사본을 수정하고 새로운 상태를 반환해야 합니다.

- 리듀서 함수는 기본적으로 `state`와 `action`이라는 현재 상태와 액션 객체를 인자로 받도록 정의합니다.
  - 액션 타입에 따라 상태를 어떻게 변경할지 결정합니다.

> 여기서 인자 state의 기본값을 필수적으로 설정해야 합니다!.
> 그 이유는 리덕스 스토어가 초기화 시 리듀서가 최초로 호출되는데, 이때 전달되는 상태는 `undefined`입니다, 리듀서가 `undefined`상태를 받았을때, 정해둔 초기상태를 반환하게 함으로써 애플리케이션의 초기상태를 `undefined`가 아닌 정해둔 기본값으로 전달받도록 해야합니다.

```tsx
import {createStore} from "redux";

const initalState = {
  todos: [
    {
      id: Date.now(),
      text: "Pure Redux로 투두리스트 구현하기",
      done: false,
    },
  ],
};

const todoReducer = (state = initalState, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {id: Date.now(), text: action.payload, done: false},
        ],
      };

    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? {...todo, done: !todo.done} : todo
        ),
      };
    default:
      return state;
  }
};

const store = createStore(todoReducer);

export default store;
```

## 4. 컴포넌트단에서 만든 상태 사용하기

**실제 컴포넌트 단에서 상태를 참조할때는 `useSelector`, 상태를 디스패치할때는 `useDispatch`라는 훅을 사용하게 됩니다.**

```ts
import {useDispatch, useSelector} from "react-redux";

/* store 내부 구성한 todos 배열을 참조하려면 */
const todos = useSelector((state) => state.todos);

/* store 내부 구성한 action을 디스패치 하려면 */
const dispatch = useDispatch();
const handleToggleTodo = (id) => () => {
  dispatch({type: "TOGGLE_TODO", payload: {id}});
};
```

**이제 `useSelector`와 `useDispatch`를 사용해, 실제 컴포넌트에서 UI를 렌더링하면 됩니다.**

### 상태 가져오기 : useSelector

- `useSelecotor`는 리덕스 스토어 내부 저장된 상태를 실제 컴포넌트로 가져오는 역할을 합니다.
  - 이훅을 통해 스토어의 특정한 부분만 선택해서 가져올 수 있습니다.
- `useSelecotor`로 가져온 todos배열을 map으로 렌더링하고 있습니다.

### 액션 디스패치 하기 : useDispatch

- `useDispatch`훅은 정의해뒀던 액션을 실행해 상태를 업데이트 할 수 있게 해줍니다.
  - 현재 프로젝트에선 새로운 할일을 추가하거나, 할일의 완료상태를 토글하는 등의 작업을 수행하게 됩니다.

```ts
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

function App() {
  const [todoText, setTodoText] = useState("");
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);

  const handleAddTodo = () => {
    dispatch({type: "ADD_TODO", payload: todoText});
  };
  const handleToggleTodo = (id) => () => {
    dispatch({type: "TOGGLE_TODO", payload: {id}});
  };

  return (
    <>
      <div>
        <input
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
        <button onClick={handleAddTodo}>할일 추가하기</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <input
              type="checkbox"
              checked={todo.done}
              onChange={handleToggleTodo(todo.id)}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
```
