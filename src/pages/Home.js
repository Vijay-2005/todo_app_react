import AddTodo from '../MyComponents/AddTodo';
import { Todos } from '../MyComponents/Todos';

const Home = ({ todos, addTodoItem, onDelete, loading }) => {
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg">
            <div className="card-body">
              <AddTodo AddTodo={addTodoItem} />
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading your todos...</p>
                </div>
              ) : (
                <Todos todos={todos} onDelete={onDelete} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
