'use strict'

const KEY = 'books'
const PAGE_SIZE = 3
var gPageIdx = 0
var gBooks = _createBooks()
var gFilterBy = {maxPrice: 1000, minRate: 0}
var gCurrBooksLength
var gCurrShowsBooks

savePreference('cards')
function _createBooks(){
    var books = loadFromStorage(KEY)
    if(!books || books.length === 0){
        books = []
        books.push(_createBook('The Hunger Games', 20))
        books.push(_createBook('Harry Potter', 30))
        books.push(_createBook('The Book Thief', 40))
        books.push(_createBook('Animal Farm', 50))
        saveToStorage(KEY, books)
    }

    return books
}

function _createBook(name, price, rate = 0){
    console.log('_getRandomImg():', _getRandomImg())
    return {
        id: makeId(),
        name,
        price,
        rate,
        imgUrl: _getRandomImg()
    }
}

function getBooks(){
    var books = gBooks.filter(book => book.rate >= gFilterBy.minRate && book.price <= gFilterBy.maxPrice)
    gCurrBooksLength = books.length
    var startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function createBook(name, price){
    gBooks.unshift(_createBook(name, price))
    saveToStorage(KEY, gBooks)
}

function updateBook(price, bookId){
    const book = gBooks.find(book => book.id === bookId)
    if(!book) return
    book.price = price
    saveToStorage(KEY, gBooks)
}

function deleteBook(bookId){
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    if(bookIdx === -1) return
    gBooks.splice(bookIdx, 1)
    saveToStorage(KEY, gBooks)
}

function getBookById(bookId){
    return gBooks.find(book => book.id === bookId)
}

function updateRate(change, gCurrBookId){
    const book = gBooks.find(book => book.id === gCurrBookId)
    if(change === -1 && book.rate === 0 || change === 1 && book.rate === 10 ) return
    book.rate += change
    saveToStorage(KEY, gBooks)
}

function getRateBook(gCurrBookId){
    return gBooks.find(book => book.id === gCurrBookId).rate
}

function setBookFilter(filterBy = {}){
    gPageIdx = 0
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    return gFilterBy
}

function nextPage(elNextButton){
    document.querySelector('.prev-button').removeAttribute('disabled')
    if ((gPageIdx + 2) * PAGE_SIZE > gCurrBooksLength) elNextButton.setAttribute('disabled', '')
    gPageIdx++ 
}

function prevPage(elPrevButton){
    document.querySelector('.next-button').removeAttribute('disabled')
    if(gPageIdx === 1) elPrevButton.setAttribute('disabled', '')
    gPageIdx--
}

function sortBooks(sortBy){
    gPageIdx = 0
    if(sortBy === 'name') gBooks.sort((book1, book2) => book1.name.localeCompare(book2.name))
    else gBooks.sort((book1, book2) => book1.price - book2.price)
}

function _getRandomImg(){
    const imgs = ['red', 'brown', 'black']
    const img = imgs[getRandomIntInclusive(0, 2)]
    return `<img src="img/${img}.png">`
}

function getPreference(){
    return preferenceLoadFromStorage('favLayout')
}

function savePreference(preference){
    preferenceSaveToStorage('favLayout', preference)
}