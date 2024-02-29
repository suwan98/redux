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
