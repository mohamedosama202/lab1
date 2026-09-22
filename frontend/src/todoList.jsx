// TodoList.jsx
import TodoItem from './todoItem';

const EMPTY_MESSAGES = {
  all: 'No tasks yet — add one above.',
  active: 'No active tasks — nice work!',
  done: 'No completed tasks yet.',
};

export default function TodoList({ todos, loading, filter, onToggle, onRename, onRemove }) {
  if (loading) return <p className="todo-loading">Loading tasks…</p>;

  if (todos.length === 0) {
    return <p className="todo-empty">{EMPTY_MESSAGES[filter] || EMPTY_MESSAGES.all}</p>;
  }

  const doneCount = todos.filter(t => t.done).length;

  return (
    <>
      <ul className="todo-list">
        {todos.map(todo => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onToggle={onToggle}
            onRename={onRename}
            onRemove={onRemove}
          />
        ))}
      </ul>
      <div className="receipt-footer">
        <span>{todos.length} item{todos.length === 1 ? '' : 's'}</span>
        <span>{doneCount} of {todos.length} done</span>
      </div>
    </>
  );
}
