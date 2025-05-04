import { useState, useEffect } from 'react';

export const TodoItem = ({ todo, onDelete, onEdit, onComplete, synced = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDesc, setEditedDesc] = useState(todo.desc || todo.description);

  // Update state when todo changes
  useEffect(() => {
    setEditedTitle(todo.title);
    setEditedDesc(todo.desc || todo.description);
  }, [todo]);

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

  const handleEditSubmit = () => {
    if (editedTitle.trim()) {
      onEdit(todo.id, editedTitle, editedDesc);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(todo.title);
    setEditedDesc(todo.desc || todo.description);
    setIsEditing(false);
  };

  const handleCompleteToggle = () => {
    onComplete(todo.id, !todo.completed);
  };

  // Get description from either field
  const description = todo.desc || todo.description;

  return (
    <div className={`todo-item card mb-3 shadow-sm ${todo.completed ? 'border-success' : ''}`}>
      <div className="card-body">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              className="form-control mb-2"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Todo title"
            />
            <textarea
              className="form-control mb-3"
              value={editedDesc}
              onChange={(e) => setEditedDesc(e.target.value)}
              placeholder="Todo description"
              rows="2"
            ></textarea>
            <div className="d-flex justify-content-end">
              <button className="btn btn-sm btn-secondary me-2" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn-sm btn-primary" onClick={handleEditSubmit}>
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="row align-items-center mb-2">
              <div className="col-md-8 col-sm-7 col-7">
                <h4 className={`todo-title ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                  {todo.title}
                </h4>
              </div>
              <div className="col-md-4 col-sm-5 col-5 text-end">
                <div className="action-buttons d-flex justify-content-end flex-wrap">
                  <button 
                    className="btn btn-sm btn-outline-success me-1 mb-1" 
                    onClick={handleCompleteToggle}
                    title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    <i className={`fas ${todo.completed ? 'fa-check-circle' : 'fa-circle'}`}></i>
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-primary me-1 mb-1" 
                    onClick={() => setIsEditing(true)}
                    title="Edit Todo"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger mb-1" 
                    onClick={() => onDelete(todo)}
                    title="Delete Todo"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
            <p className={`todo-desc mb-2 ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
              {description}
            </p>
            <div className="row align-items-center">
              <div className="col-md-8 col-sm-7 col">
                <div className="metadata">
                  {todo.createdAt && (
                    <small className="text-muted d-inline-block me-2">
                      <i className="fas fa-clock me-1"></i>
                      {formatDate(todo.createdAt)}
                    </small>
                  )}
                  {todo.userId && (
                    <small className="text-muted d-inline-block me-2">
                      <i className="fas fa-user me-1"></i>{todo.userId.slice(0, 5)}...
                    </small>
                  )}
                  {/* Sync status indicator */}
                  <small className={`d-inline-block ${synced ? 'text-success' : 'text-warning'}`}>
                    <i className={`fas ${synced ? 'fa-cloud-upload-alt' : 'fa-sync'}`}></i>
                    <span className="ms-1 d-none d-sm-inline">{synced ? 'Synced' : 'Syncing...'}</span>
                  </small>
                </div>
              </div>
              <div className="col-md-4 col-sm-5 col text-end">
                {todo.completed && (
                  <span className="badge bg-success">Completed</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem;
