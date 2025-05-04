import { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function AddTodo({ AddTodo }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !desc) {
      alert("Title or Description cannot be blank");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      const result = await AddTodo(title, desc);
      
      if (result && result.success) {
        setTitle("");
        setDesc("");
      } else {
        setErrorMessage(result?.error || "Failed to add todo. Please try again.");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="add-todo-form mb-4">
      <div className="card shadow-sm">
        <div className="card-body p-3 p-sm-4">
          <h3 className="text-center mb-3">
            <i className="fas fa-tasks me-2"></i>
            Add a New Todo
          </h3>
          
          {errorMessage && (
            <div className="alert alert-danger">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={submit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control" 
                id="title" 
                placeholder="What needs to be done?"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="desc" className="form-label">Description</label>
              <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="form-control" 
                id="desc" 
                rows="3"
                placeholder="Add some details..."
              ></textarea>
            </div>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-end">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                <i className="fas fa-plus me-2 d-none d-sm-inline"></i>
                {isSubmitting ? 'Adding...' : 'Add Todo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}