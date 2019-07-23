document.addEventListener("DOMContentLoaded", function()
{
    populatePage();
});

function populatePage()
{
    fetch("http://localhost:3000/books")
    .then(function(resp)
    {
        return resp.json();
    })
    .then(function(data)
    {
        renderDOM(data);
    })
}

function renderDOM(info)
{
    let list = document.querySelector("#list");
    list.innerHTML = " ";
    for (let i=0; i < info.length; i++)
    {
        list.append(infoInsideList(info[i]));
    }
}
function infoInsideList(thing)
{
    //Creations
    
    let newLi = document.createElement("li");

    newLi.dataset.book_id = thing.id;
    let title = document.createElement("h2");
    let newImg = document.createElement("img");
    let newDescription = document.createElement("p");
    title.innerText = thing.title;
    newImg.src = thing.img_url;
    newImg.dataset.book_id = thing.id;
    newDescription.innerText = thing.description;
    //EventListeners
    ELonbookimage(newImg);
    //Appends
    newLi.append(title);
    newLi.append(newImg);
    newLi.append(newDescription);
    return newLi;
}

function ELonbookimage(stuff)
{
    stuff.addEventListener("click", function(e)
    {
        fetch(`http://localhost:3000/books/${stuff.dataset.book_id}`)
        .then(function(resp)
        {
            return resp.json();
        })
        .then(function(data)
        {
            renderSingleBook(data);
        })
    })
}

function renderSingleBook(info)
{
    let list = document.querySelector("#list");
    list.innerHTML = " ";
    let newLi = document.createElement("li");
    let title = document.createElement("h2");
    let newImg = document.createElement("img");
    let newDescription = document.createElement("p");
    title.innerText = info.title;
    newImg.src = info.img_url;
    newImg.dataset.book_id = info.id;
    newDescription.innerText = info.description;

    let backButton = document.createElement("button");
    addEventListenerToBackButton(backButton);
    backButton.innerText = "Click To View ALL Books";
    newLi.append(backButton);
    newLi.append(title);
    newLi.append(newImg);
    newLi.append(newDescription);

    let likesList = document.createElement("ul");
    for (let j=0; j < info.users.length; j++)
    {
        let likesLi = document.createElement("li");
        likesLi.innerText = info.users[j].username;
        likesList.append(likesLi);
    }
    likesList.classList.add("likers");
    newLi.append(likesList);

    let buttonToLike = document.createElement("button");
    buttonToLike.innerText = "Click to Like";
    buttonToLike.dataset.book_id = info.id;
    addEventListenerToLikeButton(buttonToLike, info);
    newLi.append(buttonToLike);
    list.append(newLi);
}
function addEventListenerToBackButton(btn)
{
    btn.addEventListener("click", function()
    {
        populatePage();
    })
}

function addEventListenerToLikeButton(btn, info)
{
    let myself = 
    {
        "id": 1,
        "username": "pouros"
    };

    let temp = info;
    temp.users.push(myself);

    btn.addEventListener("click", function()
    {
        fetch(`http://localhost:3000/books/${btn.dataset.book_id}`,
        {
            method: "PATCH",
            headers:
            {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "users": temp.users 
            })
        })
        .then(function(resp)
        {
            return resp.json();
        })
        .then(function(data)
        {
            let theBook = document.querySelector(`.likers`);
            let myLike = document.createElement("li");
            myLike.innerText = data.users[data.users.length-1].username;
            theBook.append(myLike);
        })
    })
}

