'use strict'
var gCurrBookId
var gIsRenderByTable
// const elTable = document.querySelector('.books-container table')
function onInit() {
    if(getPreference() === 'table') gIsRenderByTable = true
    else gIsRenderByTable = false
    renderFilterByQueryStringParams()
    renderBooks()
}

function renderBooks() {
    const books = getBooks()
    if (books.length === 0) return document.querySelector('.books-container tbody').innerHTML = ''

    if (gIsRenderByTable) renderByTable(books)
    else renderByCard(books)
}

function renderByTable(books) {
    var strHTML = `<table><caption><button class="create" onclick="onCreateBook()">Create new book</button></caption>
    <thead><tr><td>Id</td><td onclick="onSortBooks('name')">Title</td><td onclick="onSortBooks('price')">Price</td>
    <td>Rate</td><td colspan="3">Action</td></tr></thead><tbody>`
    const keys = Object.keys(books[0])
    keys.pop()
    const strHTMLs = books.reduce((acc, book) => {
        acc.push('<tr>')
        acc.push(keys.map(key => `<td>${book[key]}</td>`).join(''))
        acc.push(`<td><button class="read" onclick="onReadBook('${book.id}')">Read</button></td>`)
        acc.push(`<td><button class="update" onclick="onUpdateBook('${book.id}')">Update</button></td>`)
        acc.push(`<td><button class="delete" onclick="onDeleteBook('${book.id}')">Delete</button></td></tr>`)
        return acc
    }, [])

    strHTML += strHTMLs.join('')
    document.querySelector('.books-container').innerHTML = strHTML + '</tbody></table>'
}


// function renderByCard(books) {
//     const strHTMLs = books.map(book => `
//     <article class="books-card">
//         <button class="delete-card" onclick="onDeleteBook('${book.id}')">X</button>
//         <h2>${book.name}</h2>
//         <h3>price: <span>${book.price}</span> $</h3>
//         <div class="button-div"><button class="read" onclick="onReadBook('${book.id}')">Read</button>
//         <button class="update" onclick="onUpdateBook('${book.id}')">Update</button>
//         <button class="create" onclick="onCreateBook()">Create new book</button></div>
//         <div img-div>${book.imgUrl}</div>
//     </article> 
//     `
//     )
//     document.querySelector('.books-container').innerHTML = strHTMLs.join('')
// }

function renderByCard(books) {
    const strHTMLs = books.map(book => `
    <article class="books-card">
        <button class="delete-card" onclick="onDeleteBook('${book.id}')">X</button>
        <h2>${book.name}</h2>
        <h3>price: <span>${book.price}</span> $</h3>
        <div class="button-div"><button class="read" onclick="onReadBook('${book.id}')">Read</button>
        <button class="update" onclick="onUpdateBook('${book.id}')">Update</button></div>
        <div img-div>${book.imgUrl}</div>
    </article> 
    `
    )
    document.querySelector('.books-container').innerHTML = strHTMLs.join('')
    document.querySelector('.create-container').innerHTML = '<button class="create" onclick="onCreateBook()">Create new book</button>'
}

function onCreateBook() {
    const name = prompt('Enter book name')
    const price = +prompt('Enter book price')
    if (name && price) {
        createBook(name, price)
        renderBooks()
    }
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elModal = document.querySelector('.modal')
    gCurrBookId = book.id
    elModal.querySelector('h2 .name').innerText = book.name
    elModal.querySelector('h2 .id').innerText = book.id
    elModal.querySelector('h2 .price').innerText = book.price
    elModal.querySelector('.rate').innerText = book.rate
    console.log('book.imgUrl:', book.imgUrl)
    elModal.querySelector('.img-div').innerHTML = book.imgUrl
    elModal.classList.add('open')
}

function onUpdateBook(bookId) {
    const price = +prompt('Enter new price')
    updateBook(price, bookId)
    renderBooks()
}

function onDeleteBook(bookId) {
    if (!confirm('You sure want to delete')) return
    deleteBook(bookId)
    renderBooks()
}

function onUpdateRate(elButton) {
    const change = elButton.innerText === '+' ? 1 : -1
    updateRate(change, gCurrBookId)
    document.querySelector('.rate').innerText = getRateBook(gCurrBookId)
    renderBooks()
}

function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('open')
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()
    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        maxPrice: queryStringParams.get('maxPrice') || '',
        minRate: +queryStringParams.get('minRate') || 0
    }

    if (!filterBy.maxPrice && !filterBy.minRate) return
    document.querySelector('.filter-books-maxPrice').value = filterBy.maxPrice
    document.querySelector('.filter-books-minRate').value = filterBy.minRate
    setBookFilter(filterBy)
}

function onNextPage(elButton) {
    nextPage(elButton)
    renderBooks()
}

function onPrevPage(elButton) {
    prevPage(elButton)
    renderBooks()
}

function onSortBooks(sortBy) {
    sortBooks(sortBy)
    renderBooks()
}

function switchTableCard(elButton) {
    if (elButton.innerText === 'Table'){
        document.querySelector('.create-container').innerHTML = ''
        gIsRenderByTable = true
    } else gIsRenderByTable = false
    
    renderBooks()
}