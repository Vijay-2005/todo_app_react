// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export const TodoItem = ({ todo, onDelete }) => {
  return (
    <div className="todo-item">
      <div className="d-flex justify-content-between align-items-center">
        <div className="todo-content">
          <h4 className="todo-title mb-2">{todo.title}</h4>
          <p className="todo-desc mb-0">{todo.desc}</p>
        </div>
        <button 
          className="btn delete-btn ms-3" 
          onClick={() => onDelete(todo)}
          title="Delete Todo"
        >
          <i className="fas fa-trash-alt me-2"></i>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
