const DB_PATH = 'http://localhost:3000'
const USERS_PATH = DB_PATH + '/users'
const BOOKS_PATH = DB_PATH + '/books'
const BOOK_LIST = document.querySelector('#list');
const BOOK_SHOW = document.querySelector('#show-panel');
const MY_USER = {'id': 1, 'username': 'pouros'}

class Book {
  constructor(bookJson) {
    this.id = bookJson['id'];
    this.title = bookJson['title'];
    this.description = bookJson['description'];
    this.img_url = bookJson['img_url'];
    this.users = bookJson['users'];
    this.renderListEntry();
    this.renderPanelUsers();
    this.listEntryListener();
    this.toggleReadBook();
  }

  renderListEntry() {
    this.listLi = document.createElement('li');
    this.listLi.textContent = this.title;
    BOOK_LIST.append(this.listLi);
  }

  listEntryListener(listLi=this.listLi, panelRenderer=this.renderPanelEntry()) {
    listLi.addEventListener('click', function(e) {
      BOOK_SHOW.innerHTML = '';
      BOOK_SHOW.append(panelRenderer);
    });
  }

  renderPanelEntry() {
    this.panelDiv = document.createElement('div');
    this.h3 = document.createElement('h3');
    this.h3.textContent = this.title;
    this.img = document.createElement('img');
    this.img.src = this.img_url;
    this.p = document.createElement('p');
    this.p.textContent = this.description;
    this.readButton = document.createElement('button');
    this.readButton.textContent = 'Read Book';
    this.panelDiv.append(this.h3);
    this.panelDiv.append(this.img);
    this.panelDiv.append(this.p);
    this.panelDiv.append(this.readButton);
    this.panelDiv.append(this.usersUl);
    return this.panelDiv;
  }

  renderPanelUsers(users=this.users) {
    let usersUl = document.createElement('ul');
    usersUl.className = 'users-list';
    users.forEach(function(elem) {
      let userLi = document.createElement('li');
      userLi.className = 'user'
      userLi.textContent = elem['username'];
      usersUl.append(userLi);
    });
    this.usersUl = usersUl;
  }

  toggleReadBook(button=this.readButton, users=this.users, id=this.id) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      let usersRead = Array.from(document.querySelectorAll('.user')).map(child => child.textContent)
      if (usersRead.indexOf(MY_USER['username']) >= 0) {
        alert("user has already read this book")
      }
      else {
        users.push(MY_USER);
        fetch(BOOKS_PATH + `/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({'users': users})
        })
        .then(res => res.json())
        .then(function() {
          let userLi = document.createElement('li');
          userLi.className = 'user';
          userLi.textContent = MY_USER['username'];
          document.querySelector('.users-list').append(userLi);
        })
      }
    })
  }
}

(function fetchBooks() {
  fetch(BOOKS_PATH)
  .then(res => res.json())
  .then(myJson => myJson.forEach(function(elem) {
    new Book(elem)
  }))
})();
