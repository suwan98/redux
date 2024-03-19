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
