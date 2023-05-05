import { authors,genres } from "./data.js"

/**
* Event handler for when one of the Preview divs are clicked. On fire, this 
* event will take the dataset from the nearest HTML element with the class 'preview'
* and assign it to variables
*/
export const handlePreviewClick = (event) => {
    event.preventDefault()
    // Variable to store the HTML element with the attribute 'data-list-active'
    const overlay = document.querySelector('[data-list-active]')
    overlay.toggleAttribute('open')
    // Stores the HTML elements closest to the target with the class 'preview'
    const target = event.target.closest('.preview')
    // Stores the dataset of the target elements
    const targetData = target.dataset
    // Stores book title of the dataset
    const bookTitle = targetData.previewTitle
    // Stores the author of the dataset
    const bookAuthor = targetData.previewAuthor
    // Stores the description of the dataset
    const bookDescription = targetData.previewDescription
    // Stores the image link of the dataset
    const bookImageLink = targetData.previewImg
    // Creates and stores a new date from the published date of the dataset
    const date = new Date (targetData.previewPublished)
    // Converts the date to year
    const bookPublished = date.getFullYear()
 
    // Gets and stores the target element for the title
    const overlayTitle = document.querySelector('[data-list-title]')
    // Gets and stores the target element for the image
    const overlayImg = document.querySelector('[data-list-image]')
    // Gets and stores the target element for the author
    const overlayAuthor = document.querySelector('[data-list-subtitle]')
    // Gets and stores the target element for the Description
    const overlayDescription = document.querySelector('[data-list-description]')
 
    /* 
        Adds the data grabbed to the idivdual HTML elements for title, author,
        image and description 
    */ 
    overlayTitle.innerHTML = `${bookTitle} (${bookPublished})`
    overlayAuthor.innerHTML = bookAuthor
    overlayImg.setAttribute('src', bookImageLink)
    overlayDescription.innerHTML = bookDescription
    
 }

/**
 * The purpose of this even handler is to toggle the Preview overlay 
 * (with attribute 'data-list-active) when the 'close' button on the preview 
 * is clicked
 */
export const handlePreviewToggle = () => {
    // Variable to store the HTML element with the attribute 'data-list-active'
    const overlay = document.querySelector('[data-list-active]')
    overlay.toggleAttribute('open')
}

/**
 * Take the elements in the preview divs and averts their click events
 * towards the div click event in order to fire the handlePreviewClick event
 */
export const handleClickAversion = (event) => {
    const newPreview = event.target.closest('.preview');
    newPreview.event
}

/**
 * Event handler for when the user clicks the settings button at the top of the 
 * header. This even
 * 
 */
export const handleSettingsOverlayToggle = () => {
    // Variable used to get the overlay and store it
    const settingsOverlay = document.querySelector('[data-settings-overlay]')
    settingsOverlay.toggleAttribute('open')
}

/**
 * Event handler for when the user changes the theme of the site. It is fired by
 * clicking the save button on the settings overlay
 */
export const handleSettingsSave = (event) => {
    /**
    * Holds the color values for the day theme
     */
    const day = {
        dark: '10, 10, 20',
        light: '255, 255, 255',
    }

    /**
    * Holds the color values for the night theme
    */
    const night = {
        dark: '255, 255, 255',
        light: '10, 10, 20',
    }
    event.preventDefault()
    // Assign form to variable
    const form = document.querySelector('[data-settings-form]')
    // Capture data from form
    const formData = new FormData(form)
    // Extract data from formData
    const result = Object.fromEntries(formData)

    //ternarary to check if the user selected night or day
    const isDay = result.theme === 'day'

    // Assingment of different color properties depending on user selection
    if(isDay) {
        document.documentElement.style.setProperty('--color-light', day.light);
        document.documentElement.style.setProperty('--color-dark', day.dark);
    }else {
        document.documentElement.style.setProperty('--color-dark', night.dark);
        document.documentElement.style.setProperty('--color-light', night.light);
    }
    const overlay = document.querySelector('[data-settings-overlay]')
    overlay.toggleAttribute('open')
}

/**
 * Event handler for the header search button. When clicked it will open the search 
 * overlay and allow the user to input data that they would like the books to 
 * be filtered by. This event handler is also used to create the options in both
 * the author and genre selectors
 */
export const createSearchOverlay = () => {
    // Variable used to store the overlay and used to toggle it's open attribute
    const searchOverlay = document.querySelector('[data-search-overlay]')
    searchOverlay.toggleAttribute('open')
    // Variable used to store the input for title of the search overaly
    const title = document.querySelector('[data-search-title]')
    title.focus();
    // Variable used to store the select element for genre
    const genreSelector = document.querySelector('[data-search-genres]') 
    // Variable used to store the select element for author
    const authorSelector = document.querySelector('[data-search-authors]')

    // Variable used to create a new HTML element for 'authorSelector'
    const option = document.createElement('option')
    // creation of the first option for 'All Authors'
    option.setAttribute('value', 'any')
    option.innerHTML = 'All Authors'
    authorSelector.appendChild(option)

    // Variable used to create a new option for 'genreSelector'
    const optionGenres = document.createElement('option')
    // Creation of first option for 'All Genres'
    optionGenres.setAttribute('value', 'any')
    optionGenres.innerHTML = 'All Genres'
    genreSelector.appendChild(optionGenres)
    
    // Loop through the authors and create the options with the correct ID's and names
    for (const i in authors) {
        const authorName = authors[i];
        const authorId = i
        const option = document.createElement('option')
        option.setAttribute('value', authorId)
        option.innerHTML = authorName
        authorSelector.appendChild(option)
    }
    // Loop through genres and create the options with the correct ID's and names
    for (const i in genres) {
        const genreName = genres[i]
        const genreId = i
        const option = document.createElement('option')
        option.setAttribute('value', genreId)
        option.innerHTML = genreName
        genreSelector.appendChild(option)
    }
}


