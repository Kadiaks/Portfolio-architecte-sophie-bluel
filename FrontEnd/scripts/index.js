const worksUrl = "http://127.0.0.1:5678/api/works"
const categoriesUrl = "http://127.0.0.1:5678/api/categories"
//const usersUrl = "http://127.0.0.1:5678/api/users"
//127.0.0.1:5678/api/works
fetch(worksUrl)
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
    })

//127.0.0.1:5678/api/categories
fetch(categoriesUrl)
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
    })

//127.0.0.1:5678/api/users
/*fetch(usersUrl)
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
    })
    */