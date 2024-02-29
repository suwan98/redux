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
