// import React from 'react';
import { TodoItem } from './TodoItem';

export const Todos = (props) => {
  return (
    <div className="container">
      <h3 className="text-center my-3">Todos List</h3>
      {props.todos.length === 0 ? 
        <div className="text-center">No Todos to display</div> 
        :
        props.todos.map((todo) => {
          return <TodoItem key={todo.id} todo={todo} onDelete={props.onDelete} />
        })
      }
    </div>
  );
}


