// App.jsx
import { useState, useEffect } from 'react';
import TodoForm from './todoForm';
import TodoList from './todoList';
import FilterTabs from './filterTabs';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api/todos';
import './todo.css';

const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
});

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    const done = filter === 'all' ? undefined : filter === 'done';

    fetchTodos(done)
      .then(data => {
        if (ignore) return;
        setTodos(data);
        setLoading(false);
      })
      .catch(err => {
        if (ignore) return;
        console.error(err);
        setLoading(false);
      });

    return () => { ignore = true; };
  }, [filter]);

  const handleAdd = async (title) => {
    const newTodo = await createTodo(title);
    if (filter !== 'done') {
      setTodos([newTodo, ...todos]);
    }
  };

  const handleToggle = async (id, done) => {
    const updated = await updateTodo(id, { done: !done });
    if (filter === 'all') {
      setTodos(todos.map(t => t._id === id ? updated : t));
    } else {
      setTodos(todos.filter(t => t._id !== id));
    }
  };

  const handleRename = async (id, title) => {
    const updated = await updateTodo(id, { title });
    setTodos(todos.map(t => t._id === id ? updated : t));
  };

  const handleRemove = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter(t => t._id !== id));
  };

  const handleFilterChange = (next) => {
    if (next === filter) return;
    setLoading(true);
    setFilter(next);
  };

  return (
    <div className="receipt-page">
      <div className="receipt">
        <header className="receipt-header">
          <span className="stamp">Tasks</span>
          <p className="receipt-date">{today}</p>
        </header>

        <TodoForm onAdd={handleAdd} />
        <FilterTabs filter={filter} onChange={handleFilterChange} />
        <TodoList
          todos={todos}
          loading={loading}
          filter={filter}
          onToggle={handleToggle}
          onRename={handleRename}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
}
