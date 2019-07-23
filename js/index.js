let ulOfBooks = document.querySelector("#list")
let showPanel = document.querySelector("#show-panel")

document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:3000/books")
    .then(response => response.json())
    .then(books => renderBooks(books))
})

function renderBooks(books){
    books.forEach(book => {
        renderOneBookLi(book);
    })
    let clearButton = document.createElement("button");
    clearButton.innerText = "🗑"
    document.body.append(clearButton);
    clearButton.addEventListener('click', function(){
        document.querySelector("#show-panel").remove();
    })

}

function showBookInfo(book){
    console.log(book);
    let clearBookDiv = document.querySelector('#book-details');
    if (clearBookDiv != null){
        clearBookDiv.remove();
    }

    let bookThumbnail = document.createElement('img');
    bookThumbnail.src = `${book.img_url}`;
    
    let bookDescription = document.createElement('p');
    bookDescription.innerText = `${book.description}`;

    let ulOfUsers = document.createElement('ul');
    book.users.forEach(user => {
        let userLi = document.createElement('li');
        userLi.innerText = user.username;
        ulOfUsers.append(userLi);
    })

    let bookLikeButton = document.createElement("button");
    bookLikeButton.innerText = likedBook(book) ? "💙" : "🖤";
    bookLikeButton.addEventListener('click', function(){
        if (likedBook(book)){
            unLikeBook(book);
        } else {
            likeBook(book);
        }
    })
        
    let bookInfoDiv = document.createElement('div');  
    bookInfoDiv.id = "book-details";  
    bookInfoDiv.append(bookThumbnail);
    bookInfoDiv.append(bookDescription);
    bookInfoDiv.append(ulOfUsers);
    bookInfoDiv.append(bookLikeButton);
    
    showPanel.append(bookInfoDiv);

    
}

function likedBook (book){
   for(let i = 0; i < book.users.length; i++){
       if (book.users[i].username === "pouros"){
            return true;
       }
   }
   return false;
}

function renderOneBookLi(book){
    let bookLi = document.createElement('li');
    bookLi.dataset.id = `${book.id}`;
    bookLi.innerText = `${book.title}`;
    bookLi.addEventListener('click', function(event){
        showBookInfo(book);
    })

    ulOfBooks.append(bookLi);
}

function likeBook(book) {
    books.users.push({"id": 1, "username": "pouros"});
    updateBook(book);
}

function unLikeBook(book){
    books.users.pop({"id": 1, "username": "pouros"});
    updateBook(book);
}

function updateBook(book){
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accepts: "application/json"
        },
        body: JSON.stringify({
            "users": book.users
        })
    }).then(response => response.json())
    .then(book => showBookInfo(book))
}

