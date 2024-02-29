# Pure Redux로 Todolist 만들기

## 0. 필요한 패키지 설치

- Redux와 React-Redux 패키지를 설치합니다.

```bash
pnpm i -D redux react-redux

```

## 1. 액션 타입 정의하기

- 액션타입은 보통 문자열 상수로 저장되며, 해당 액션이 어떤 작업인지 명시하는 용도로 사용됩니다.
- as const를 통해 문자열 리터럴 타입을 상수로 선언합니다.

```tsx
/* constants/todoActionsType.ts*/

export const ADD_TODO = "ADD_TODO" as const;
export const TOGGLE_TODO = "TOGGLE_TODO" as const;
export const REMOVE_TODO = "REMOVE_TODO" as const;
```

## 2. 액션 생성 함수 만들기

- 액션 생성 함수는 액션 타입을 기반으로 실제 액션 객체를 만드는 함수입니다.
- 여기서 payload는 액션이 실제로 어떤 데이터를 다루는지 나타내는 영역입니다.
  - 예를들어서, 할일을 추가하는 액션의 액션타입은 ADD_TODO일것이고 페이로드는 실제로 추가할 할일의 내용이 될것입니다.
  - 이렇게 페이로드는 액션 생성 함수의 인자로 전달되어, 액션 객체 내부에 들어가게 됩니다.
- id값은 uuid 라이브러리를 사용해 id값을 사용하겠습니다.

```tsx
/* reudx/actions/todoAction.ts*/

import {v4 as uuidV4} from "uuid";
import {
  ADD_TODO,
  REMOVE_TODO,
  TOGGLE_TODO,
} from "../../constants/todoActionType";

// 각 액션별로 타입을 정의합니다.
interface AddTodoAction {
  type: typeof ADD_TODO;
  payload: {
    id: string;
    text: string;
  };
}

interface ToggleTodoAction {
  type: typeof TOGGLE_TODO;
  payload: string;
}

interface RemoveTodoAction {
  type: typeof REMOVE_TODO;
  payload: string;
}

export const addTodo = (text: string): AddTodoAction => ({
  type: ADD_TODO,
  payload: {
    id: uuidV4(),
    text,
  },
});

export const toggleTodo = (id: string): ToggleTodoAction => ({
  type: TOGGLE_TODO,
  payload: id,
});

export const removeTodo = (id: string): RemoveTodoAction => ({
  type: REMOVE_TODO,
  payload: id,
});
```

### 2-1 타입 별도로 분리하기

- 이쯤에서 타입들이 많아지고 관리가 어려워짐을 느낍니다.
- 타입들을 별도의 types 파일로 분리해 한곳에서 관리할 수 있도록 합니다.

```jsx
/* types/todoTypes.ts */

import {ADD_TODO, REMOVE_TODO, TOGGLE_TODO} from "../constants/todoActionType";

// 초기 상태의 타입을 정의합니다.
export interface Todo {
  id: string;
  text: string;
  done: boolean;
}

export type InitialStateType = Todo[];

// 액션 타입을 정의합니다.
export interface AddTodoAction {
  type: typeof ADD_TODO;
  payload: {
    id: string,
    text: string,
  };
}

export interface ToggleTodoAction {
  type: typeof TOGGLE_TODO;
  payload: string;
}

export interface RemoveTodoAction {
  type: typeof REMOVE_TODO;
  payload: string;
}

export type TodoActionTypes =
  | AddTodoAction
  | ToggleTodoAction
  | RemoveTodoAction;
```

### 2-1 타입분리한 파일 기반으로 todoAction 리팩토링

- 분리한 타입액션들을 import해와서 해당 액션들을 리턴값으로 받는것으로 리팩토링합니다.

```tsx
import {v4 as uuidV4} from "uuid";
import {
  ADD_TODO,
  REMOVE_TODO,
  TOGGLE_TODO,
} from "../../constants/todoActionType";
import {
  AddTodoAction,
  RemoveTodoAction,
  ToggleTodoAction,
} from "../../types/todoTypes";

export const addTodo = (text: string): AddTodoAction => ({
  type: ADD_TODO,
  payload: {
    id: uuidV4(),
    text,
  },
});

export const toggleTodo = (id: string): ToggleTodoAction => ({
  type: TOGGLE_TODO,
  payload: id,
});

export const removeTodo = (id: string): RemoveTodoAction => ({
  type: REMOVE_TODO,
  payload: id,
});
```

## 3. 리듀서 함수 만들기

- 리듀서는 현재 상태와 액션객체를 인수로 받아 새로운 상태를 반환하는 순수함수로 이루어져야합니다.
- 리듀서 내부에선 액션 타입에 따라 상태를 어떻게 변경할지를 결정합니다.

```tsx
import {
  ADD_TODO,
  REMOVE_TODO,
  TOGGLE_TODO,
} from "../../constants/todoActionType";
import {InitialStateType, TodoActionTypes} from "../../types/todoTypes";

const initalState: InitialStateType = [];

function todoReducer(state = initalState, action: TodoActionTypes) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          id: action.payload.id,
          text: action.payload.text,
          done: false,
        },
      ];
    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id === action.payload ? {...todo, done: !todo.done} : todo
      );
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.payload);
    default:
      return state;
  }
}

export default todoReducer;
```

## 4. 스토어 생성하기

- 앱의 전체 상태를 담당하는 스토어 파일을 만듭니다.
- 스토어는 리듀서 함수를 항상 인자로 받습니다.

```tsx
/* store/todoStore.ts*/

import {createStore} from "redux";
import todoReducer from "../reducers/todoReducer";

const todoStore = createStore(todoReducer);

export default todoStore;
```

## 5. 실제 컴포넌트 단에서 스토어 사용하기

- Provider로 설정한 store를 래핑하여 공급해줍니다.

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {Provider} from "react-redux";
import todoStore from "./redux/store/todoStore";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={todoStore}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

## 전역상태를 통한 TodoList 실제 구현

- 이제 Action도 구성했고 Reducer도 구성했고.. 준비는 끝났습니다.
