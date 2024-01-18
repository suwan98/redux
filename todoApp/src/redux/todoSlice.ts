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
