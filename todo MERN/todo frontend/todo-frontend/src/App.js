import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const api_url = process.env.REACT_APP_API_URL;

  // fetch todos 
  const [alltodos, setalltodos] = useState([]);

  const fetchTodos = () => {
    fetch(`${api_url}/getall`, {
      method: 'GET'
    }).then(
      res => res.json()
    ).then(
      data => {
        setalltodos(data.Todos);
      }
    ).catch(
      error => console.log(error.message)
    )
  }

  useEffect(() => {
    fetchTodos()
  });

  // delete todo 
  const deleteTodo = (id) => {
    fetch(`${api_url}/delete/${id}`, {
      method: 'DELETE'
    }).then(
      res => res.json()
    ).then(
      data => {
        alert(data.message);
      }
    ).catch(
      error => console.log(error.message)
    );
  }

  // create todo
  const [todo, settodo] = useState({
    title: '',
    description: ''
  });
  const createTodo = () => {
    if (todo.title === '') {
      return alert('Title should not be empty!');
    }

    fetch(`${api_url}/create`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(todo)
    }).then(
      res => res.json()
    ).then(
      data => {
        alert(data.message);
      }
    ).catch(
      error => console.log(error.message)
    );
  }

  // update
  const [isedit, setisedit] = useState(false);
  const [todoid, settodoid] = useState(null);
  const [updatetodo, setupdatetodo] = useState({
    title: '',
    description: '',
    completed: false
  });


  // edit check 
  const editCheck = (id) => {
    setupdatetodo({
      title:'',
      description:'',
      completed:false
    });
    setisedit(true);
    settodoid(id);
  }

  const updateTodo = () => {
    if (updatetodo.title === '') {
      return alert('Title should not be empty!');
    }

    fetch(`${api_url}/update/${todoid}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updatetodo)
    }).then(
      res => res.json()
    ).then(
      data => {
        alert(data.message);
        setisedit(false);
        settodoid(null);
      }
    ).catch(
      error => console.log(error.message)
    );
  }


  return (
    <div className="App">
      <p>{api_url || 'No API URL'}</p>
      <hr></hr>

      {
        alltodos.map(todo => (
          <div key={todo._id}>
            {
              isedit && todoid === todo._id ? (
                <div>
                  <input type="text" placeholder='title' onChange={(e) => { setupdatetodo({ ...updatetodo, title: e.target.value }) }}></input>
                  <input type="text" placeholder='description' onChange={(e) => { setupdatetodo({ ...updatetodo, description: e.target.value }) }}></input>
                  <span>Complete?</span> <input type="checkbox" onChange={(e)=>{setupdatetodo({...updatetodo , completed : e.target.checked})}}></input>
                  <button onClick={updateTodo}>Update Todo</button>
                </div>
              ) : (
                <div>
                  <h3>{todo.title}</h3>
                  <p>{todo.description}</p>
                  <p>{todo.completed ? 'Completed' : 'Not Completed'}</p>

                  <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                  <button onClick={() => editCheck(todo._id)}>EDIT</button>

                  <br></br>
                  <hr></hr>
                  <br></br>
                </div>
              )
            }
          </div>
        )

        )
      }

      <hr></hr>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <h2>Create Todo Task</h2>
      <input type="text" placeholder='title' onChange={(e) => { settodo({ ...todo, title: e.target.value }) }}></input>
      <input type="text" placeholder='description' onChange={(e) => { settodo({ ...todo, description: e.target.value }) }}></input>
      <button onClick={createTodo}>Create Todo</button>


      <hr></hr>
      <br></br>
      <br></br>
      <br></br>
      <br></br>


    </div>
  );
}

export default App;

