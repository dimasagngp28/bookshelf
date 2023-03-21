const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId() {
    return +new Date();
  }
   
function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    }
}

function makeBook(bookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = bookObject.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = bookObject.year;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(bookTitle, bookAuthor, bookYear, buttonContainer);
    container.setAttribute('id', `book-${bookObject.id}`);
 
    
    if (bookObject.isCompleted) {
        

        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = 'Belum selesai dibaca';
        undoButton.setAttribute('id', 'undo-button');


        undoButton.addEventListener('click', function() {
            undoTaskFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus';
        trashButton.setAttribute('id', 'trash-button');

        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(bookObject.id);
        });

        buttonContainer.append(undoButton, trashButton);
            return container;

    }   else {
        const doneButton = document.createElement('button');
        doneButton.classList.add('green');
        doneButton.innerText = 'Selesai Dibaca';
        doneButton.setAttribute('id', 'done-button');


        doneButton.addEventListener('click', function() {
            addTaskToCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus';
        trashButton.setAttribute('id', 'trash-button');

        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(bookObject.id);
        });

        buttonContainer.append(doneButton, trashButton);
    }
    return container;
}
function addTaskToCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
    
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
function removeTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
  
function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
  
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
function saveData () {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}
function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
}
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}
function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}
function findBookIndex(bookId) {
    for (index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return -1;
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
      }
  });
function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const BookYear = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
   
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, BookYear, isComplete);
    books.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
document.addEventListener(RENDER_EVENT, function () {
    const incompletedBookList = document.getElementById('incompleteBookshelfList');
    incompletedBookList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted)
            incompletedBookList.append(bookElement);
        else completeBookshelfList.append(bookElement);
    }
});
const checkbox = document.getElementById('inputBookIsComplete');
checkbox.addEventListener('click', function() {
    button = document.querySelector('#bookSubmit span');
    if (checkbox.checked) {
        button.innerText = 'Selesai dibaca';
    } else {
        button.innerText = 'Belum selesai dibaca';
    }
});