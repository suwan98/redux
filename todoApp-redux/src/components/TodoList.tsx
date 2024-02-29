import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

function TodoList() {
  const [text, setText] = useState("");
  const todos = useSelector((state) => {
    console.log(state);
    return state.todos;
  });
  const dispatch = useDispatch();

  return <></>;
}

export default TodoList;
