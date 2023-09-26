
fetch('http://localhost:8000/getTodo').then( 
    response => response.json()
).then(
    (tododata) => {
        console.log(tododata.Todos);
        document.querySelector('.t').innerHTML = JSON.stringify(tododata);
    }
)

document.querySelector('.send').addEventListener('click', () => {
    const taskName = document.querySelector('.task').value;
    const isComplete = document.querySelector('.complete').checked;

    if(taskName){
        const data = {
            task: taskName,
            complete: isComplete
        };
    
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
    
        fetch('http://localhost:8000/postTodo', requestOptions)
            .then(response => response.json())
            .then(responseData => {
                console.log('Response:', responseData);
                // Update the DOM with the response
                document.querySelector('.t').innerText = JSON.stringify(responseData);
            })
            .catch(error => console.error('Error:', error));
    }
});
