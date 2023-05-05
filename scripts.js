import {books, BOOKS_PER_PAGE,authors} from './data.js'
import { handlePreviewClick, handlePreviewToggle, handleClickAversion, handleSettingsOverlayToggle, handleSettingsSave, createSearchOverlay} from './eventHandlers.js'
/**
 * Holds the lenght of books (imported form data.js). 
 * Books serves as the data for this website
 */
const RANGE = books.length
// If books is not an array or if it's length is 1 thorw errors
if (!books && !Array.isArray(books)) throw new Error('Source required') 
if (!RANGE && RANGE.length < 2) throw new Error('Range must be an array with two numbers')

/**
 * Counter to keep track of the number of PAGES to be displayed. 
 * This is used in later event handler to dictate how many books need to be displayed
 */
export let PAGES = 1

/**
 * Global variables used to detect changes in genre, title, author
 */
let CURRENTGENRE = 'none'
let CURRENTAUTHOR = 'none'
let CURRENTTITLE = 'none'
/**
 * This is the event handler for the button with the attribute 'data-list-button'.
 * This is also known as the 'Show More' button. Main function of this event handler
 * is to increment PAGES to tell createPreviews how many PAGES of preview divs
 * to display
 */
const handleShowMoreClick = () => {
    PAGES ++
    searchButton.click()

    /* Stores the overlay cancel button and clicks it in order to hide the overlay
      that pops up as a result of the createPreviews function being called
    */
    const searchOverlayCancelButton = document.querySelector('[data-search-cancel]')
    searchOverlayCancelButton.click()
}

/**
 * Event handler used to create the previews. It is called on startup to create the
 * previews and also called when a filter is applied to the list of books and the search
 * button is clicked. 
 */
const createPreviews = (event) => {  
    event.preventDefault()
    // Initialise filters to be correct for when the site loads
    let filters = {
        title : '',
        genre : 'any',
        author : 'any'
    }
    // Variable used to store the form data of 'data-search-form'
    const formData = new FormData(document.querySelector('[data-search-form]'))
    // Copy values from search form over to filters object
    filters = Object.fromEntries(formData)

    //ternaries to check if values match global values
    const isCurrentAuhtor = CURRENTAUTHOR === filters.author
    const isCurrentGenre = CURRENTGENRE === filters.genre
    const isCurrentTitle = CURRENTTITLE === filters.title
    // Assginment of global variables
    if (!isCurrentAuhtor || !isCurrentGenre || !isCurrentTitle) {
        CURRENTAUTHOR = filters.author
        CURRENTGENRE = filters.genre
        CURRENTTITLE = filters.title
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    

    // Initialisation of extracted books array
    let extractedBooks = []
    // ternary to check if the current genre is equals to 'any'
    const genreAny = filters.genre === 'any'
    // ternary to check if the current author is equals to 'any'
    const authorAny = filters.author === 'any'
    // ternary to check if the current title is ''
    const titleEmpty = filters.title === ''

    // Conditional to check whether extractedBooks should be assigned with books as is
    // or should it be worked through with a specified title/genre/author
    if (genreAny &&  authorAny && titleEmpty) {
        extractedBooks = books
    } else {
        for(let i = 0; i < books.length; i++) {
            // variable to store title with extra spaces removed and lowercased
            const trimTitle = filters.title.trim().toLowerCase()
            // variable to store the lowercase of the book[i] title
            const lowerCaseBookTitle = books[i].title.toLowerCase()

            // Check if title and author matches the captured inputs.
            const titleMatch = lowerCaseBookTitle.includes(trimTitle)? true : false
            const authorMatch = filters.author === 'any' || books[i].author === filters.author
            let genreMatch = ''
            // Loop to check the genres of the book[i]
            for(let j =0; j< books[i].genres.length; j++) {
                // Check to see if genre of book matches input
                if (books[i].genres[j] === filters.genre) {
                    genreMatch = true 
                    break
                } else {
                    genreMatch = false
                }
                
            }

                if ((titleMatch && authorMatch) && (genreMatch || genreAny)){
                    extractedBooks.push(books[i])
                }
                const dataMessage = document.querySelector('[data-list-message]')
                // Check to see if no results were found
                if (extractedBooks.length < 1) { 
                    dataMessage.classList.add('list__message_show')
                } else {
                    dataMessage.classList.remove('list__message_show')
                }
            }
    }
    // Assign the button 'data-list-button to variable'
    const button = document.querySelector('[data-list-button]')
    // Assign the parent to be appended to variable
    const listItem = document.querySelector('[data-list-items]')
    listItem.innerHTML = ''
    // Create new fragment
    const fragment = document.createDocumentFragment()
    let remaining = 0

    // Loop  to ensure the books displayed matches the selection of user
    for (let i = 0; i < BOOKS_PER_PAGE * PAGES; i++) {
        let authorId
        // if statement to stop loop if array returns undefined values
        if (extractedBooks[i] === undefined) {
            // Change button text
            button.innerHTML= 'Show More 0'
            break
        } else {
            authorId = extractedBooks[i].author
        }

        /**
         * create object of book with the captured values
         */
        const book ={
            author : authors[authorId],
            authorID : authorId,
            id : extractedBooks[i].id,
            image : extractedBooks[i].image,
            title : extractedBooks[i].title,
            description : extractedBooks[i].description,
            published : extractedBooks[i].published
        }
        // Create new HTML 'div'
        const element = document.createElement('div')
        // Assign event listener to div
        element.addEventListener('click', handlePreviewClick)
        // Assign class to div
        element.classList = 'preview'
        // Assign attributes to div
        element.setAttribute('data-preview-id', book.id)
        element.setAttribute('data-preview-img', book.image)
        element.setAttribute('data-preview-title', book.title)
        element.setAttribute('data-preview-author', book.author)
        element.setAttribute('data-preview-description', book.description)
        element.setAttribute('data-preview-published', book.published)

        // Create div inner HTML
        element.innerHTML = /* html */ `
            <img
                class="preview__image"
                src="${book.image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${book.title}</h3>
                <div class="preview__author">${book.author}</div>
            </div>
        `
        // Add event listeners to different elements in div
        const newTitle = element.querySelector('.preview__title')
        newTitle.addEventListener('click', handleClickAversion)
        const newImg = element.querySelector('.preview__image')
        newImg.addEventListener('click', handleClickAversion)
        const newAuthor = element.querySelector('.preview__author')
        newAuthor.addEventListener('click', handleClickAversion)

        fragment.appendChild(element)
        remaining = extractedBooks.length - (BOOKS_PER_PAGE * PAGES)
        // searchOverlayCancelButton.click()
    }
    
    // Append new fragment to 'data-list-items'
    const dataList = document.querySelector('[data-list-items]')
    dataList.appendChild(fragment)

    const dataListButton = document.querySelector('[data-list-button]')

    // Check to see if button should be disabled or not
    if (remaining > 0) {
        dataListButton.innerHTML = /* html */ `
            <span>Show more</span>
            <span class="list__remaining"> (${remaining})</span>
        `
        dataListButton.removeAttribute('disabled')
    } else {
        dataListButton.setAttribute('disabled', true)
    }

    // Fire event to close search overlay
    const searchOverlayCancelButton = document.querySelector('[data-search-cancel]')
    searchOverlayCancelButton.click()
}

const showMoreButton = document.querySelector('[data-list-button]')
showMoreButton.addEventListener('click', handleShowMoreClick)

const searchButton = document.querySelector("body > dialog:nth-child(4) > div > div > button.overlay__button.overlay__button_primary")
searchButton.addEventListener('click', createPreviews)

const listCloseButton = document.querySelector('[data-list-close]')
listCloseButton.addEventListener('click', handlePreviewToggle)

const settingsSaveButton = document.querySelector("body > dialog:nth-child(5) > div > div > button.overlay__button.overlay__button_primary")
settingsSaveButton.addEventListener('click', handleSettingsSave)

const settingsCancelButton = document.querySelector('[data-settings-cancel]')
settingsCancelButton.addEventListener('click', handleSettingsOverlayToggle)

const settingsOverlayButton = document.querySelector('[data-header-settings]')
settingsOverlayButton.addEventListener('click', handleSettingsOverlayToggle)

const searchOverlayCancelButton = document.querySelector('[data-search-cancel]')
searchOverlayCancelButton.addEventListener('click', createSearchOverlay)

const headerSearch = document.querySelector('[data-header-search]') 
headerSearch.addEventListener('click', createSearchOverlay)
headerSearch.click()
searchButton.click()