document.addEventListener("DOMContentLoaded", function() {

    fetch("http://localhost:3000/books")
    .then(response => response.json())
    .then(renderBooks)

    function renderBooks(data) {
        const ul = document.getElementById("list")
        data.forEach(function(book) {
            
            const title = book.title 
            const description = book.description
            const image = book.img_url
            const id = book.id 
            const li = document.createElement("li")
            console.log(id)
            li.id = `${id}`

            
            li.innerHTML = `
                    <h2>${title}</h2>
                    `
            ul.appendChild(li)

            const h2 = li.querySelector("h2")
            h2.id = `${id}`
            console.log(h2)
            h2.addEventListener("click", clickBook)
        })

    }
    
    function clickBook(event) {
        const id = event.target.id 
        fetch(`http://localhost:3000/books/${id}`)
        .then(response => response.json())
        .then(showBook)
    }
    function showBook(book) {
        console.log(book)
        const show = document.getElementById("show-panel")
        const image = book.img_url 
        const description = book.description
        const users = book.users 
        
        show.innerHTML = `
        <img src=${image}>
        <br>
        ${description}
        <h4 id="id-${book.id}">Users who like this book: </h4>
        <h3> <button id=${book.id} type="button">Like</button> <h3>
        `
        const ul = document.createElement("ul")
        ul.id = "usersLike"
        document.querySelector("h4").appendChild(ul)
        users.forEach(user => {
            let li = document.createElement("li")
            li.id = `${user.id}`
            li.innerHTML = `
                    ${user.username}`
            ul.append(li)
        })
        const button = document.querySelector("button")
        button.addEventListener("click", likeBook)

        function likeBook(event) {
            const bookId = event.target.id
            console.log(bookId)
            const ul = document.querySelector("#usersLike")
            let listItems = ul.querySelectorAll("li")
            const users = []
            listItems.forEach(listItem => {
                let id = listItem.id 
                let username = listItem.innerText
                users.push({"id": id, "username": username})
            })

            users.push({"id": "1", "username": "pouros"})

            const formData = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "users": users 
                })
            }

            fetch(`http://localhost:3000/books/${bookId}`, formData)
            .then(response => response.json())
            .then(updateLikes)


            function updateLikes(data) {
                console.log(data.users)
                const ul = document.querySelector("#usersLike")
                ul.innerHTML = ""
                data.users.forEach(user =>{
                let li = document.createElement("li")
                li.id = `${user.id}`
                li.innerHTML = `
                        ${user.username}`
                ul.append(li)
                })
            }
        }

    }


});
