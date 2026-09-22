// filterTabs.jsx
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'done', label: 'Done' },
];

export default function FilterTabs({ filter, onChange }) {
  return (
    <div className="filter-tabs">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={`filter-tab${filter === key ? ' active' : ''}`}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
