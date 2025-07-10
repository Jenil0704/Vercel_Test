// "use client"
import { useEffect, useState } from "react";
import axios from "axios";
// Define Todo type
interface Todo {
  id: string;
  title: string;
  createdAt?: string; // optional if not always included
}

export default function Home() {
  const [title, setTitle] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async (): Promise<void> => {
    const res = await axios.get<Todo[]>("/api/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (): Promise<void> => {
    if (!title.trim()) return;
    await axios.post("/api/todos", { title });
    setTitle("");
    fetchTodos();
  };

  const handleDelete = async (id: string): Promise<void> => {
    await axios.delete(`/api/todos/${id}`);
    fetchTodos();
  };

  const handleEdit = async (id: string, newTitle: string): Promise<void> => {
    await axios.put(`/api/todos/${id}`, { title: newTitle });
    fetchTodos();
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">📝 Todo App (CRUD with Firebase)</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-2 py-1 w-full"
          placeholder="Enter task"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-3 py-1 rounded">
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="border p-2 flex justify-between items-center">
            <span>{todo.title}</span>
            <div className="space-x-2">
              <button
                onClick={() => {
                  const newTitle = prompt("Edit title:", todo.title);
                  if (newTitle) handleEdit(todo.id, newTitle);
                }}
                className="text-blue-500"
              >
                Edit
              </button>
              <button onClick={() => handleDelete(todo.id)} className="text-red-500">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
