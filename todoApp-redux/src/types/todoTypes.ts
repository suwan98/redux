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
    id: string;
    text: string;
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
