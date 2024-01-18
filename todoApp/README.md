# Redux로 TodoList 만들기

## 0. Set Up

**리덕스 툴킷과 React-Redux 패키지를 프로젝트에 추가합니다.**

```bash
pnpm i -D @reduxjs/toolkit react-redux
```

## 1. 스토어 생성 후 초기상태 정의하기

**먼저, redux 폴더를 생성하고 폴더 내부에 store.ts 파일을 정의하고 configureStore를 통해 스토어를 내보냅니다.**

- 아직 reducer 함수는 정의되지 않았으므로 빈객체로 지정했습니다.

```ts
import {configureStore} from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {},
});

export default store;
```

## 2. 만든 store를 Provider의 프로퍼티로 할당하기

- 만든 `store`의 상태는 전역적으로 관리되어야 하기 때문에, `main.tsx`에서 `Provider` 컴포넌트로 `App`을 감쌉니다.
  - Provider 컴포넌트는 `react-redux`에서 제공하는 컴포넌트로 해당 Provider를 통해 전역 상태를 공급할 수 있게됩니다.

```js
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

## TodoSlice 생성하기

**마찬가지로 redux 폴더 내부에서 한번에 관리하기 위해 redux 폴더 내부로 todoSlice.ts 파일을 생성합니다.**

- 여기서 실제 리듀서 함수가 정의되고 초기상태를 설정하는 역할을 하게됩니다.
- Redux Toolkit의 `createSlice` 함수를 통해 **액션 타입**, **액션 생성 함수**, **리듀서**들을 한번에 생성하고 관리할 수 있게됩니다.

```ts
import {createSlice, nanoid, PayloadAction} from "@reduxjs/toolkit";

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

const initialState: Todo[] = [
  {id: nanoid(), text: "Redux 학습하기", done: false},
];

export const todoSlice = createSlice({
  name: "redux/todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: nanoid(),
        text: action.payload,
        done: false,
      };
      state.push(newTodo);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.done = !todo.done;
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((todo) => todo.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const {addTodo, toggleTodo, removeTodo} = todoSlice.actions;

export default todoSlice.reducer;
```

## 코드 살펴보기

1. initalState를 정의해 slice에 넘겨줄 변수를 설정합니다.

### createSlice

**createSlice API는 기존 Redux 작성시, 리듀서,액션, 불변성을 지키는 업데이트를 작성하는데 작성해야하는 상용구들을 모두 제거하도록 설계되었습니다.**

- 기존 `action.text` 나 `action.id`와 같이 고유한 이름의 모든 필드는 해당 필드들이 포함된 객체인 `action.payload`로 대체할 수 있습니다.
- 기존 `redux`에서 spread-syntax로 값을 복사 해 복사한 값을 업데이트 하는 방식이 아닌, 자체적으로 `immer` 라이브러리가 탑재되어 있으므로 상태를 직접적으로 업데이트하는 로직을 작성할 수 있게 합니다.

### reducers 내부에서 직접적인 기능 설정하기

**이제 우리가 할일은 slice의 reducers 내부에서 기능들을 설정하는 일입니다.**

- 간단한 `todoApp`을 구현하기로 했으니 기능은 할일 추가, 할일 내부에서 완료 여부 토글링, 할일 삭제 이 세가지 기능을 다루겠습니다.
  - 여기서 [nanoid](https://redux-toolkit.js.org/api/other-exports)는 리덕스 툴킷에서 제공하는 함수로, 암호화 되지 않은 임의의 문자열 ID를 추가해줍니다.

```js
console.log(nanoid()); // 'dgPXxUz_6fWIQBD8XmiSy'
```

**1.addTodo**

- 할일을 추가해주는 기능을 하게 됩니다.
  - 여기서 text는 `action.payload`로 설정하게 되는데, 최종적으로 사용자의 `input`을 상태로 받고 해당 `input`이 text로 가게될 것입니다.
- 이후 `push`를 통해 기존 `state` 배열에 새로운 TodoItem을 추가합니다.

**2.toggleTodo**

- `toggleTodo`는 `Array.find` 메서드를 통해 `todo`의 id가 `action.payload`와 같으면, 즉, 사용자가 해당 TodoItem을 눌렀을 때 발생하며, 최종적으로 사용자가 클릭한 TodoItem의 `done` 상태가 토글링됩니다.

**3.removeTodo**

- todoItem을 삭제하는 로직입니다.
- `findIndex` 메서드를 통해 index가 -1과 같지않으면 즉, 유효한 인덱스라면 todoItem을 삭제합니다.

- 최종적으로 만든 액션들을 구조분해 할당(`todoSlice.actions`) 후 내보냅니다.
  - todoSlice의 Reducer 또한 내보냅니다.

## store 재정의하기

**기존 `store`의 `reducer` 내부에서 빈 객체로 남겨두었던 todos를 만든 slice로 재정의합니다.**

```js
import {configureStore} from "@reduxjs/toolkit";
import todosReducer from "./todoSlice";

const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export default store;
```

<br />
<br />

## App에서 만든 상태 사용 및 이벤트 적용

**이제 준비는 끝났습니다. 만든 전역상태를 실제 컴포넌트 단에서 사용할 수 있습니다!**

> `useSelector`를 통해 정의한 상태를 참조할 수 있습니다.
> `useDispacth`를 통해 액션을 디스페치 즉, 이벤트 핸들링을 할 수 있습니다.

**이제 handleAddTodo와 같은 함수들을 추가해 실질적인 UI가 업데이트 될 수 있도록 로직을 작성합니다.**

- 이미 `slice` 파일 내부에서 기능들을 전부 정의해서 필요한건 `find`나, `findIndex`에서 필요한 `action.payload`, 즉 `id`값만 매개변수로 전달해주면 됩니다.

```tsx
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addTodo, removeTodo, toggleTodo} from "./redux/todoSlice";

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

function App() {
  const [inputTodo, setInputTodo] = useState("");
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const handleAddTodo = () => {
    dispatch(addTodo(inputTodo));
    setInputTodo("");
  };

  const handleToggleTodo = (id: string) => () => {
    dispatch(toggleTodo(id));
  };

  const handleRemoveTodo = (id: string) => () => {
    dispatch(removeTodo(id));
  };

  return (
    <>
      <div>
        <input
          type="text"
          value={inputTodo}
          onChange={(e) => setInputTodo(e.target.value)}
        />
        <button onClick={handleAddTodo}>할일 추가</button>
        {todos.map((todo: Todo) => (
          <li key={todo.id}>
            <span
              style={{textDecoration: todo.done ? "line-through" : "none"}}
              onClick={handleToggleTodo(todo.id)}>
              {todo.text}
            </span>
            <button onClick={handleRemoveTodo(todo.id)}>할일 삭제</button>
          </li>
        ))}
      </div>
    </>
  );
}

export default App;
```

<br />
<br />

### 이제 todos 상태에 따라 지속적으로 상태가 변하는 기본적인 기능을 가지고 있는 TodoList가 만들어졌습니다! 👋

<br />

<p align="center"><img src="/assets/todo.gif"></p>
