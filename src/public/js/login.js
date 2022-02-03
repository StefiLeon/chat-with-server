let form = document.getElementById('loginForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    let data = new FormData(form);
    let prepObject = {
        email: data.get('email'),
        password: data.get('password')
    }
    fetch('/login', {
        method: "POST",
        body: JSON.stringify(prepObject),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(result => result.json()).then(json => {
        console.log(json);
        location.replace('../chat/')
    })
})

let btn = document.getElementById('facebook-login')
btn.addEventListener('click', (e) => {
    location = "https://dc00-200-127-0-176.ngrok.io/auth/facebook"
})