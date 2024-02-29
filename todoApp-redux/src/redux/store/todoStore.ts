import {createStore} from "redux";
import todoReducer from "../reducers/todoReducer";

const todoStore = createStore(todoReducer);

export default todoStore;
