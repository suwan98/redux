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
