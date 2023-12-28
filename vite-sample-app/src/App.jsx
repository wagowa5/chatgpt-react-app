import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  const handleClick = () => {
    // リストtodosの中身を展開してtodoを追加する
    setTodos([...todos, todo]);
    setTodo("");
  };

  return (
    <>
      <h1>Todo App</h1>
      <input
        type="text"
        placeholder="input your task..."
        // 仮想DOMのtodoを表示
        value={todo}
        // 物理DOMの変更内容がe
        // 物理DOMが変更されたときsetTodoで仮想DOMを更新
        onChange={(e) => setTodo(e.target.value)}
      ></input>
      <button onClick={handleClick}>Add Todo</button>
      {todos.map((element, index) => (
        <div key={index}>
          <input type="checkbox" id={index}></input>
          <label 
            // htmlForでチェックボックスと紐付け
            htmlFor={index}>
              {element}
          </label>
        </div>
      ))}
    </>
  );
}

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

export default App
