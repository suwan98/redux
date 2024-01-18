import {useSelector} from "react-redux";

function App() {
  const todos = useSelector((state) => state.todos);
  console.log(todos);

  return (
    <>
      <div></div>
    </>
  );
}

export default App;
