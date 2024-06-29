const localSimpan = "SIMPAN_BUKU";

const title = document.querySelector("#inputNamaBuku");
const author = document.querySelector("#inputPenulisBuku");
const year = document.querySelector("#inputTahunBuku");
const isRead = document.querySelector("#inputSelesaiBaca");
const btnSubmit = document.querySelector("#bukuMasukRak");
const searchValue = document.querySelector("#cariJudulBuku");
const btnSearch = document.querySelector("#cariBuku");
const btnReset = document.querySelector("#resetButton");

function formValidation() {
  function validation(check) {
    return check.value === "";
  }
  return validation(title) || validation(author) || validation(year);
}

isRead.addEventListener("change", function () {
  const isReadcheck = isRead.checked;
  if (isReadcheck) {
    document.querySelector(".isComplete").style.display = "inline-block";
    document.querySelector(".isNotCompleted").style.display = "none";
  } else {
    document.querySelector(".isNotCompleted").style.display = "inline-block";
    document.querySelector(".isComplete").style.display = "none";
  }
});

window.addEventListener("load", function () {
  if (localStorage.getItem(localSimpan) !== "") {
    const booksData = getData();
    renderData(booksData);
  }
});

btnSubmit.addEventListener("click", function () {
  const formVal = formValidation();
  if (formVal) {
    alert("Masih ada data yang kosong, silahkan diperiksa kembali!!");
  } else {
    const yearValue = parseInt(year.value); // Mengonversi tahun menjadi angka dengan parseInt
    const newBook = {
      id: +new Date(),
      title: title.value.trim(),
      author: author.value.trim(),
      year: yearValue,
      isComplete: isRead.checked,
    };
    insertData(newBook);
    clear();
  }
});

btnReset.addEventListener("click", function () {
  searchValue.value = "";
  renderData(getData());
});

btnSearch.addEventListener("click", function (e) {
  e.preventDefault();
  if (localStorage.getItem(localSimpan) === "") {
    alert("Tidak ada data buku");
    return location.reload();
  } else {
    const getByTitle = getData().filter(
      (a) => a.title == searchValue.value.trim()
    );
    if (getByTitle.length === 0) {
      const getByAuthor = getData().filter(
        (a) => a.author == searchValue.value.trim()
      );
      if (getByAuthor.length === 0) {
        const getByYear = getData().filter(
          (a) => a.year == searchValue.value.trim()
        );
        if (getByYear.length === 0) {
          alert(`Data yang anda cari tidak ditemukan`);
          return location.reload();
        } else {
          renderSearchResult(getByYear);
        }
      } else {
        renderSearchResult(getByAuthor);
      }
    } else {
      renderSearchResult(getByTitle);
    }
  }
  searchValue.value = "";
});

function renderSearchResult(books) {
  renderData(books);
}

function clear() {
  title.value = "";
  author.value = "";
  year.value = ""; // Mengosongkan input tahun setelah data dimasukkan
  isRead.checked = false;
}

function getData() {
  return JSON.parse(localStorage.getItem(localSimpan)) || [];
}

function insertData(books) {
  alert(`Yeay! Data buku BERHASIL DITAMBAHKAN`);
  let book = books;
  let dataBuku = [];
  if (localStorage.getItem(localSimpan) === null) {
    dataBuku = [];
  } else {
    dataBuku = JSON.parse(localStorage.getItem(localSimpan));
  }
  dataBuku.push(book);
  localStorage.setItem(localSimpan, JSON.stringify(dataBuku));
  renderData(getData());
}

function renderData(books = []) {
  const inCompleted = document.querySelector("#incompleteBookshelfList");
  const completed = document.querySelector("#completeBookshelfList");
  inCompleted.innerHTML = "";
  completed.innerHTML = "";
  books.forEach((book) => {
    if (book.isComplete == false) {
      let el = `
        <article class="book_item shadow">
          <div class="book-information">
            <h3 style="text-align:justify;">${book.title}</h3>
            <p style="text-align:justify;">Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
          </div>
          <div class="action action-control-book">
            <button class="bg-success text-white" onclick="readedBook('${book.id}')">
              <span>Selesai Dibaca</span>
            </button>
            <button class="bg-danger text-white" onclick="removeBook('${book.id}')">
              <span>Hapus</span>
            </button>
          </div>
        </article>
      `;
      inCompleted.innerHTML += el;
    } else {
      let el = `
        <article class="book_item shadow">
          <div class="book-information">
            <h3 style="text-align:justify;">${book.title}</h3>
            <p style="text-align:justify;">Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
          </div>
          <div class="action action-control-book" >
            <button onclick="unreadedBook('${book.id}')">
              <span>Belum Selesai Dibaca</span>
            </button>
            <button  onclick="removeBook('${book.id}')">
              <span>Hapus</span>
            </button>
          </div>
        </article>
      `;
      completed.innerHTML += el;
    }
  });
  getBooksInformation();
}

function removeBook(id) {
  let cfm = confirm("Anda yakin akan menghapus data buku ini ?");
  if (cfm == true) {
    const dataBukuDetail = getData().filter((a) => a.id == id);
    const dataBuku = getData().filter((a) => a.id != id);
    localStorage.setItem(localSimpan, JSON.stringify(dataBuku));
    renderData(getData());
    alert(`[Buku ${dataBukuDetail[0].title}] telah terhapus dari rak`);
  } else {
    return 0;
  }
  getBooksInformation();
}

function readedBook(id) {
  let cfm = confirm("Pindahkan buku ke rak yang SELESAI DIBACA ?");
  if (cfm == true) {
    const dataBukuDetail = getData().filter((a) => a.id == id);
    const newBook = {
      id: dataBukuDetail[0].id,
      title: dataBukuDetail[0].title,
      author: dataBukuDetail[0].author,
      year: dataBukuDetail[0].year,
      isComplete: true,
    };
    const dataBuku = getData().filter((a) => a.id != id);
    localStorage.setItem(localSimpan, JSON.stringify(dataBuku));
    insertData(newBook);
  } else {
    return 0;
  }
  getBooksInformation();
}

function unreadedBook(id) {
  let cfm = confirm("Pindahkan buku ke rak yang BELUM SELESAI DIBACA ?");
  if (cfm == true) {
    const dataBukuDetail = getData().filter((a) => a.id == id);
    const newBook = {
      id: dataBukuDetail[0].id,
      title: dataBukuDetail[0].title,
      author: dataBukuDetail[0].author,
      year: dataBukuDetail[0].year,
      isComplete: false,
    };
    const dataBuku = getData().filter((a) => a.id != id);
    localStorage.setItem(localSimpan, JSON.stringify(dataBuku));
    insertData(newBook);
  } else {
    return 0;
  }
  getBooksInformation();
}

function getBooksInformation() {
  let completed = notCompleted = 0;
  const bookshelf = getData();
  const allBooks = bookshelf.length;
  for (let i = 0; i < allBooks; i++) {
    if (bookshelf[i]['isComplete']) {
      completed += 1;
    } else {
      notCompleted += 1;
    }
  }
  document.querySelector("#totalBookCount").innerHTML = allBooks;
  document.querySelector("#totalCompleteCount").innerHTML = completed;
  document.querySelector("#totalnotCompleteCount").innerHTML = notCompleted;
}