const displayCardBtn = document.querySelector('.add');
const pageMask = document.querySelector('.page');
const card = document.querySelector('.window');
const form = document.querySelector('form');
const deleteAll = document.getElementById('delete-all');
const cancelBtn = document.querySelector('.cancel');
const submitBtn = document.querySelector('.submit');
const titleCard = document.getElementById('title');
const authorCard = document.getElementById('author');
const pagesCard = document.getElementById('pages');
const readCardBox = document.getElementById('read');
const tbody = document.querySelector('tbody');

let myLibrary = [];

class Book{
    constructor(title, author, pages, status) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.status = status;
    }
}

function addBookToLibrary() {
    let title = titleCard.value;
    let author = authorCard.value;
    let pages = pagesCard.value;
    let status = statusCard();
    let newBook = new Book(title, author, pages, status);
    myLibrary.push(newBook);
    storageLibrary();
    displayBook();
}

function statusCard() {
    if(readCardBox.checked) {
        return true;
    }
    else {
        return false;
    }
}

function displayCard() {
    displayCardBtn.addEventListener('click', () => {
        pageMask.style.display = 'block';
        card.style.display = 'block';
    })
}
displayCard();

function hideCard() {
    pageMask.style.display = 'none';
    card.style.display = 'none';
}
hideCard();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    addBookToLibrary();
    hideCard();
    clearForm();
    displayBook();
})

function cancelCard() {
    cancelBtn.addEventListener('click', hideCard)
}
cancelCard();

function clearForm() {
    title.value = '';
    author.value = '';
    pages.value = '';
    readCardBox.checked = false;
}

function clearAll() {
    deleteAll.addEventListener('click', () => {
        myLibrary = [];
        tbody.innerHTML = '';
        localStorage.removeItem('myLibrary');
        bookDetails();
    })
}
clearAll();

function storageLibrary() {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function checkStorageLibrary() {
    if(localStorage.getItem('myLibrary')) {
        myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
    } else {
        myLibrary.innerHTML = '';
    }
}

function bookDetails() {
    const totalBooks = document.querySelector('.total-books');
    const readBooks = document.querySelector('.read-books');
    const unreadBooks = document.querySelector('.unread-books');
    const readPages = document.querySelector('.read-pages');
    let readCounter = 0;
    let unreadCounter = 0;
    let pagesCounter = 0;
    readBooks.textContent = 0;
    unreadBooks.textContent = 0;
    readPages.textContent = 0;
    for(let i = 0; i < myLibrary.length; i++) {
        if(myLibrary[i].status === true) {
            readCounter += 1;
            readBooks.textContent = readCounter;
            pagesCounter += parseInt(myLibrary[i].pages);
            readPages.textContent = pagesCounter;
        } else if(myLibrary[i].status === false) {
            unreadCounter += 1;
            unreadBooks.textContent = unreadCounter;
        }
    }
    totalBooks.textContent = myLibrary.length;
}
bookDetails();

function displayBook() {
    checkStorageLibrary();
    bookDetails();
    tbody.textContent = '';

    const removeRow = document.querySelectorAll('.row');
    console.log('Show me the node count of current DOM card row...', removeRow);
    for(let i = 0; i < removeRow.length; i++) {
        removeRow[i].remove();
    }

    let index = 0;
    for(i = 0; i < myLibrary.length; i++) {
        const bookRow = document.createElement('tr');
        bookRow.classList.add('row');
        tbody.appendChild(bookRow);
        //BOOK TITLE
        const bookTitle = document.createElement('td');
        bookTitle.textContent = myLibrary[i].title;
        bookRow.appendChild(bookTitle);
        //BOOK AUTHOR
        const bookAuthor = document.createElement('td');
        bookAuthor.textContent = myLibrary[i].author;
        bookRow.appendChild(bookAuthor);
        //BOOK PAGES
        const bookPages = document.createElement('td');
        bookPages.textContent = myLibrary[i].pages;
        bookRow.appendChild(bookPages);
        //BOOK STATUS
        const bookStatus = document.createElement('td');
        if(myLibrary[i].status === false) {
            bookStatus.classList.add('material-icons', 'unread');
        } else if(myLibrary[i].status === true) {
            bookStatus.classList.add('material-icons', 'read')
        }

        bookStatus.dataset.linkedArray = index;
        console.log('show the dataset link back to the array FOR READ STATUS BUTTON...', bookStatus.dataset.linkedArray);
        bookRow.appendChild(bookStatus);

        bookStatus.addEventListener('click', changeStatus);

        function changeStatus() {
            let statusToChange = bookStatus.dataset.linkedArray;
            const toggleBook = new Book();
            console.log('What is the toggle initial value?...', myLibrary[parseInt(statusToChange)].status);

            if((myLibrary[parseInt(statusToChange)].status) == true) {
                bookStatus.classList.remove('read');
                bookStatus.classList.add('unread');
                toggleBook.status = false;
                myLibrary[parseInt(statusToChange)].status = toggleBook.status;
            } else if((myLibrary[parseInt(statusToChange)].status) == false) {
                bookStatus.classList.remove('unread');
                bookStatus.classList.add('read');
                toggleBook.status = true;
                myLibrary[parseInt(statusToChange)].status = toggleBook.status;
            }
            storageLibrary();
            bookDetails();
            displayBook();
        }

        //BOOK DELETE
        const bookDeleteBtn = document.createElement('td');
        bookDeleteBtn.classList.add('material', 'delete');
        
        console.log('show me my current array objects inside of for...', myLibrary);
        
        bookDeleteBtn.dataset.linkedArray = index;
        console.log('show me the dataset link back to the array...', bookDeleteBtn.dataset.linkedArray);
        bookRow.appendChild(bookDeleteBtn);
        
        bookDeleteBtn.addEventListener('click', removeBookFromLibrary);

        function removeBookFromLibrary() {
            let bookToRemove = bookDeleteBtn.dataset.linkedArray;
            console.log('Attempting to remove item via data attribute...', parseInt(bookToRemove));
            myLibrary.splice(parseInt(bookToRemove), 1);
            bookRow.remove();
            storageLibrary();
            displayBook();
        }
        storageLibrary();
        index++;
    }
}
displayBook();