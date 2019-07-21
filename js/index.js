const LIST_OF_BOOKS = document.querySelector('#list');
const SHOW_PANEL = document.querySelector("#show-panel");

function likeOrUnlike(book) {
	for (user of book.users){ 
		if (user.id == 1) {
			return "UNLIKE";
		}
	}
	return "LIKE";
}
// shows all of the books in a list from the database
function showBooks(books) {
	for (book of books) {
		bookItem = document.createElement('li');
		bookItem.dataset.id = book.id;
		bookItem.innerText = `${book.title}`;
		bookItem.innerHTML += `<button data-book-id="${book.id}"> ${likeOrUnlike(book)} </button>`
		LIST_OF_BOOKS.append(bookItem);
	}
}

// fetches the books from the databse and returns them as a json file
function fetchBooks() {
	return fetch('http://localhost:3000/books')
	.then(resp => resp.json());
}

// When page loads automatically displays the books rom the database
document.addEventListener("DOMContentLoaded", event => {
	fetchBooks()
	.then(showBooks);
});

// creates a list of users that liked a book
function listOfUsers(book) {
	let listOfUsers = document.createElement('ul');
	for (user of book.users) {
		listOfUsers.innerHTML += `<li> ${user.username} liked ${book.title}. </li>`;
	}
	return listOfUsers;
}

// shows the desried book and its info in the show section
function showBook(book) {
	SHOW_PANEL.innerHTML = "";
	let thumbnail = document.createElement('img');
	thumbnail.setAttribute('src', `${book["img_url"]}`);
	SHOW_PANEL.append(thumbnail);
	SHOW_PANEL.innerHTML += `Description: ${book.description}`
	SHOW_PANEL.append(listOfUsers(book));
}

// listens for click on a book name to display the books info
document.addEventListener("click", event => {
	if (event.target.nodeName == "LI") {
		let bookId = parseInt(event.target.dataset.id);
		fetchBooks()
		.then(books => {
			for (book of books) {
				if (book.id == bookId) {
					showBook(book);
				}
			}
		})
	}
});

// likes the book with the current user
function likeBook(book) {
	fetch(`http://localhost:3000/books/${book.id}`, { 
		method: "PATCH",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"users": [...book.users,
				{"id":1, "username":"pouros"}
			]
		})
	});
}

function unlikeBook(book) {
	let newUsersArray = []; 
	book.users.forEach(user => {
		if (user.username != "pouros") {
			newUsersArray.push(user);
		}
	})
	fetch(`http://localhost:3000/books/${book.id}`, { 
		method: "PATCH",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"users": newUsersArray
		})
	});

}

//toggles between like and dislike display on the DOM
function toggle(button) {
	if (button.innerText == "LIKE") {
		button.innerText = "UNLIKE";
	}
	else {
		button.innerText = "LIKE";
	}
}

//listens for like button being pressed
document.addEventListener("click", event => {
	if (event.target.nodeName == "BUTTON") {
		let bookId = parseInt(event.target.dataset.bookId);
		fetchBooks()
		.then(books => {
			for (book of books) {
				if (book.id == bookId) {
					if (event.target.innerText == "LIKE"){
						likeBook(book);
						toggle(event.target);
					}
					else {
						unlikeBook(book);
						toggle(event.target);
					}
				}
			}
		})
	}
})

