let author;

fetch('/currentUser', {
    method: 'POST'
}).then(result => result.json())
.then(json => console.log(json))
.catch(err => {
    console.log(err)
})

let btn = document.getElementById('logout');
btn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    location.replace('../');
})