let bookList = document.querySelector("#list");
let showPanel = document.querySelector("#show-panel");

function getBooks() {
    fetch("http://localhost:3000/books")
    .then(resp => resp.json())
    .then(parseBooks);
};

getBooks();

function parseBooks(data) {
    data.forEach(book => {
        addBookToDom(book);
    });
};

function addBookToDom(book) {
    let newLi = document.createElement("li");
    newLi.id = "book";
    newLi.innerHTML = `
    <p>Name: ${book.title}</p>
    <hr>`
    newLi.addEventListener("click", function(){
        displayThumbnail(book); 
    });

    bookList.append(newLi);
};

function displayThumbnail(book) {
    let userLikes = document.createElement("ul");
    let likeButton = document.createElement("button");
    userLikes.id = book.id;
    likeButton.innerText = "Like!📚"
    book.users.forEach(user =>{
        let userLi = document.createElement("li");
        userLi.innerText = user.username;
        userLikes.append(userLi);
    });
    
    showPanel.innerHTML = `
        <img src=${book.img_url}/>
        <br>
        <p>Description: ${book.description}</p>
        <br>
    `
    showPanel.append(userLikes);
    showPanel.append(likeButton);

    likeButton.addEventListener("click", function(){
        patchLikeOnBook(book);
    })
};

function patchLikeOnBook(book) {
    console.log(book.users)
    let users = book.users;
    let newUser = {id: 1, username:"pourous"}
    users.push(newUser)
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ 
            users
        })
    })
    .then(resp => resp.json())
    .then(function(book) {
        addLikeToDom(book);
    })
}

function addLikeToDom(book) {
    let bookId = book.id;
    let currentBookUl = document.querySelector(`ul[id="${bookId}"]`);
    let newUser = document.createElement("li");
    newUser.innerText = "Pourous";
    currentBookUl.append(newUser);
}
