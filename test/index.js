function test() {
    return alert('Hello world!');
}

//function to fetch data from the API
function get() {
    fetch('/crud/testCollection')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            document.getElementById('data').innerHTML = JSON.stringify(data);
        });
}

//function to post data to the API
function post() {
    fetch('/crud/testCollection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'John Doe'
        })
    })
        .then(response => response.json())
        .then(data => console.log(data));
}
//function to update data in the API
function put() {
    //get the id of the document to update
    let id = document.getElementById('id').value;
    fetch(`/crud/testCollection`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            _id: id,
            name: 'John Smith'
        })
    })
        .then(response => response.json())
        .then(data => console.log(data));
}
function remove() {
    //get the id of the document to delete
    let id = document.getElementById('id').value;
    fetch(`/crud/testCollection/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(data => console.log(data));
}