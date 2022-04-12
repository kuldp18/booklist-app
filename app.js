// Book class : represents a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class : handle ui tasks

class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => {
      UI.addBookToList(book);
    });
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;
    list.appendChild(row);
  }

  static deleteBook(el) {
    el.classList.contains('delete')
      ? el.parentElement.parentElement.remove()
      : '';
  }

  static showAlert(message, alertType) {
    const div = document.createElement('div');
    div.className = `alert alert-${alertType}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    // vanish in 3 secs
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// store class: handles storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    const newBooks = books.filter((book) => book.isbn !== isbn);
    localStorage.setItem('books', JSON.stringify(newBooks));
  }
}

// event: display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// event: add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // prevent actual submit
  e.preventDefault();
  //   form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill in all the fields', 'danger');
  } else {
    // instantiate new book
    const newBook = new Book(title, author, isbn);
    //   add book to ui
    UI.addBookToList(newBook);
    // add book to store
    Store.addBook(newBook);
    // success message
    UI.showAlert('Book added!', 'info');
    //   clear fields
    UI.clearFields();
  }
});

// event: remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
  UI.deleteBook(e.target);
  //   store delete
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  //   success message
  UI.showAlert('Book removed!', 'info');
});
