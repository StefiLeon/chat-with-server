//Registro
let formRegister = document.getElementById('registerForm');
formRegister.addEventListener('submit', function(e) {
    e.preventDefault();
    let data = new FormData(formRegister);
    let prepObject = {
        nombre: data.get('nombre'),
        apellido: data.get('apellido'),
        edad: data.get('edad'),
        alias: data.get('alias'),
        email: data.get('email'),
        password: data.get('password')
    }
    fetch('/register', {
        method: "POST",
        body: JSON.stringify(prepObject),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(result => result.json())
    .then(json => {
        formRegister.reset();
        console.log('Usuario registrado.');
        location.replace('../chat/')
    })
})