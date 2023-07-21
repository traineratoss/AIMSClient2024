const API_URL = 'http://localhost:8080/ideas/';

async function LoadIdeas(){
    const response = await fetch(API_URL + 'getAllIdeas/page');
    const json = await response.json();
    const todos = json.todos;
    const data = [];
    todos.forEach(element => {
        const item = createNewTodoItem(element.todo, element.completed);
        data.push(item);
    });
    return data;
}

