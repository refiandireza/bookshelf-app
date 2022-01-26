const UNFINISHED_BOOK_LIST_ID = 'unfinished-book-list-detail';
const FINISHED_BOOK_LIST_ID = 'finished-book-list-detail';
const BOOK_ITEMID = 'bookId';

function addBook() {
  const unfinishedBookList = document.getElementById(UNFINISHED_BOOK_LIST_ID);

  const finishedBookList = document.getElementById(FINISHED_BOOK_LIST_ID);

  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;

  let isCompleted;
  if (document.querySelector('input[name="status"]:checked').value === 'finished') {
    isCompleted = true;
  } else if (document.querySelector('input[name="status"]:checked').value === 'unfinished') {
    isCompleted = false;
  }

  const book = createBook(title, author, year, isCompleted);
  const bookObject = composeBookObject(title, author, year, isCompleted);

  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);

  if (isCompleted) {
    finishedBookList.append(book);
  } else {
    unfinishedBookList.append(book);
  }

  updateDataToStorage();
}

function createBook(title, author, year, isCompleted) {
  const titleText = document.createElement('td');
  titleText.classList.add('title-row');
  titleText.innerHTML = title;

  const authorText = document.createElement('td');
  authorText.classList.add('author-row');
  authorText.innerHTML = author;

  const yearText = document.createElement('td');
  yearText.classList.add('year-row');
  yearText.innerHTML = year;

  const finishedButton = document.createElement('td');
  finishedButton.append(createTrashButton(), createUndoButton());

  const unfinishedButton = document.createElement('td');
  unfinishedButton.append(createTrashButton(), createCheckButton());

  const row = document.createElement('tr');
  row.classList.add('parent-row');

  row.append(titleText, authorText, yearText);

  if (isCompleted) {
    row.append(finishedButton);
  } else {
    row.append(unfinishedButton);
  }
  return row;
}

function createButton(buttonTypeClass, icon, addEventListener) {
  const button = document.createElement('button');
  button.classList.add(buttonTypeClass);
  button.innerHTML = icon;
  button.addEventListener('click', (event) => {
    addEventListener(event);
  });
  return button;
}

function createCheckButton() {
  return createButton('check-button', '<i class="fas fa-check-circle"></i>', (event) => {
    addBookToFinishedRead(event.target.closest('.parent-row'));
  });
}

function createTrashButton() {
  return createButton('trash-button', '<i class="fas fa-trash"></i>', (event) => {
    removeBookFromStorage(event.target.closest('.parent-row'));
  });
}

function createUndoButton() {
  return createButton('undo-button', '<i class="fas fa-times-circle"></i>', (event) => {
    undoBookFromFinishedRead(event.target.closest('.parent-row'));
  });
}

function addBookToFinishedRead(taskElement) {
  const finishedBook = document.getElementById(FINISHED_BOOK_LIST_ID);

  const bookTitle = taskElement.querySelector('.title-row').innerText;
  const bookAuthor = taskElement.querySelector('.author-row').innerText;
  const bookYear = taskElement.querySelector('.year-row').innerText;

  const newBook = createBook(bookTitle, bookAuthor, bookYear, true);
  const book = findBook(taskElement[BOOK_ITEMID]);
  book.isCompleted = true;
  newBook[BOOK_ITEMID] = book.id;

  finishedBook.append(newBook);
  taskElement.remove();

  updateDataToStorage();
}

function undoBookFromFinishedRead(taskElement) {
  const unfinishedBook = document.getElementById(UNFINISHED_BOOK_LIST_ID);

  const bookTitle = taskElement.querySelector('.title-row').innerText;
  const bookAuthor = taskElement.querySelector('.author-row').innerText;
  const bookYear = taskElement.querySelector('.year-row').innerText;

  const newBook = createBook(bookTitle, bookAuthor, bookYear, false);

  const book = findBook(taskElement[BOOK_ITEMID]);
  book.isCompleted = false;
  newBook[BOOK_ITEMID] = book.id;

  unfinishedBook.append(newBook);
  taskElement.remove();

  updateDataToStorage();
}

function removeBookFromStorage(taskElement) {
  const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
  books.splice(bookPosition, 1);

  if (confirm('Are you sure to DELETE this BOOK?')){
    taskElement.remove();
    updateDataToStorage();
  }
}

function refreshDataFromBook() {
  const unfinishedBookList = document.getElementById(UNFINISHED_BOOK_LIST_ID);

  const finishedBookList = document.getElementById(FINISHED_BOOK_LIST_ID);

  for (book of books) {
    const newBook = createBook(book.title, book.author, book.year, book.isCompleted);
    newBook[BOOK_ITEMID] = book.id;
    

    if (book.isCompleted) {
      finishedBookList.append(newBook);
    } else {
      unfinishedBookList.append(newBook);
    }
  }
}

function clearText() {
  document.getElementById('inputBookTitle').value = '';
  document.getElementById('inputBookAuthor').value = '';
  document.getElementById('inputBookYear').value = '';
}

function searchBookByTitle() {
  const searchInput = document.getElementById('searchBookTitle').value.toUpperCase();
  const rows = document.querySelectorAll('.parent-row');
  rows.forEach((row) => {
    row.querySelector('.title-row').textContent.toUpperCase().startsWith(searchInput) ? (row.style.display = '') : (row.style.display = 'none');
  });
}


