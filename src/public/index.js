fetch('/currentUser')
.then(result => result.json())
.then(result => {
    console.log('result', result);
    if(result.status === 401 || result.status === 403) location.replace('/login/')
    else {
        location.replace('/chat')
    }
}).catch(err => {
    console.log(err)
    location.replace('/login/')
})