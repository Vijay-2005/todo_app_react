import { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function AddTodo({ AddTodo }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title || !desc) {
      alert("Title or Description cannot be blank");
      return;
    }
    AddTodo(title, desc);
    setTitle("");
    setDesc("");
  }

  return (
    <div className="add-todo-form mb-4">
      <h3 className="text-center mb-4">Add a New Todo</h3>
      <form onSubmit={submit}>
        <div className="form-floating mb-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control custom-input"
            id="title"
            placeholder="Enter Title"
          />
          <label htmlFor="title">Todo Title</label>
        </div>
        <div className="form-floating mb-3">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="form-control custom-input"
            id="desc"
            placeholder="Enter Description"
            style={{height: "100px"}}
          ></textarea>
          <label htmlFor="desc">Todo Description</label>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Add Todo <i className="fas fa-plus ms-2"></i>
        </button>
      </form>
    </div>
  );
}