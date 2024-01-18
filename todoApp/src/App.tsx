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
