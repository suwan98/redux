import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

function App() {
  const [todoText, setTodoText] = useState("");
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);

  const handleAddTodo = () => {
    dispatch({type: "ADD_TODO", payload: todoText});
  };
  const handleToggleTodo = (id) => () => {
    dispatch({type: "TOGGLE_TODO", payload: {id}});
  };

  return (
    <>
      <div>
        <input
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
        <button onClick={handleAddTodo}>할일 추가하기</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <input
              type="checkbox"
              checked={todo.done}
              onChange={handleToggleTodo(todo.id)}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
