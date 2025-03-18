// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export const TodoItem = ({ todo, onDelete }) => {
  // Format the date if it exists
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (err) {
      return '';
    }
  };

  return (
    <div className="todo-item">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
        <div className="todo-content flex-grow-1 mb-2 mb-sm-0">
          <h4 className="todo-title mb-2">{todo.title}</h4>
          <p className="todo-desc mb-1">{todo.desc}</p>
          {todo.createdAt && (
            <small className="text-muted">
              <i className="fas fa-clock me-2"></i>
              {formatDate(todo.createdAt)}
            </small>
          )}
        </div>
        <button 
          className="btn delete-btn mt-2 mt-sm-0" 
          onClick={() => onDelete(todo)}
          title="Delete Todo"
        >
          <i className="fas fa-trash-alt me-2"></i>
          <span className="d-none d-sm-inline">Delete</span>
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
