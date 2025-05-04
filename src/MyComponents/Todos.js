// import React from 'react';
import { TodoItem } from './TodoItem';

export const Todos = (props) => {
  return (
    <div className="container-fluid px-sm-3 px-md-4">
      <h3 className="text-center my-3">Todos List</h3>
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          {props.todos.length === 0 ? 
            <div className="text-center p-4 bg-light rounded shadow-sm">
              <i className="fas fa-tasks mb-3" style={{ fontSize: '2rem', opacity: 0.5 }}></i>
              <p className="mb-0">No Todos to display</p>
            </div> 
            :
            props.todos.map((todo) => {
              return (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onDelete={props.onDelete} 
                  onEdit={props.onEdit}
                  onComplete={props.onComplete}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  );
}


