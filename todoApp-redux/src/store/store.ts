import {createStore} from "redux";
import {persistReducer} from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";

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

const persistConfigOptions = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfigOptions, todoReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export {store, persistor};
