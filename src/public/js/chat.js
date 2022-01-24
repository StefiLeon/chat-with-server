const socket = io();

//NORMALIZR
const authors = new normalizr.schema.Entity('authors', {}, {idAttribute:'_id'});
const messages = new normalizr.schema.Entity('messages',  {
    author: authors
}, {idAttribute:'_id'});
const parentObject = new normalizr.schema.Entity('parent', {
    messages: [messages]
})

//Recuperar usuario
let author;
fetch('/currentUser')
.then(result => result.json())
.then(json => {
    author = json;
    console.log(author);
    let welcome = document.getElementById('author-name');
    welcome.innerHTML = `<p class="username">Bienvenido ${author.alias}</p><button class="btn btn-light" type="submit" id="outlog">Cerrar sesión</button>`
})

//Evento de input
let input = document.getElementById('message');
input.addEventListener('keyup', (e) => {
    if(e.key === "Enter") {
        if(e.target.value) {
            socket.emit('message', {message:e.target.value})
            e.target.value = "";
        }
    }
})

socket.on('message', data => {
    let p = document.getElementById('chatLog');
    let denormalizedData = normalizr.denormalize(data.result, parentObject, data.entities);
    console.log(denormalizedData);
    let messages = denormalizedData.messages.map(message => {
        return `<p><span class="nombre-autor">${message.author.alias}</span> dice: <span>"${message.text}"</span></p>`
    }).join(' ');
    p.innerHTML = messages;
})