import { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function AddTodo({ AddTodo }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !desc) {
      alert("Title or Description cannot be blank");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await AddTodo(title, desc);
      setTitle("");
      setDesc("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="add-todo-form mb-4">
      <h3 className="text-center mb-4">
        <i className="fas fa-tasks me-2"></i>
        Add a New Todo
      </h3>
      <form onSubmit={submit}>
        <div className="form-floating mb-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control custom-input"
            id="title"
            placeholder=" "
            disabled={isSubmitting}
          />
          <label htmlFor="title">
            <i className="fas fa-heading me-2"></i>
            Todo Title
          </label>
        </div>
        <div className="form-floating mb-3">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="form-control custom-input"
            id="desc"
            placeholder=" "
            style={{height: "100px"}}
            disabled={isSubmitting}
          ></textarea>
          <label htmlFor="desc">
            <i className="fas fa-align-left me-2"></i>
            Todo Description
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Adding...
            </>
          ) : (
            <>
              Add Todo <i className="fas fa-plus ms-2"></i>
            </>
          )}
        </button>
      </form>
    </div>
  );
}