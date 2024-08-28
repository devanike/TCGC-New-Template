const clearSearchField = document.getElementById("clear")
const searchInput = document.getElementById("search-input")
const profilePicture = document.getElementById("profile-pic")
const profileDropDown = document.getElementById("profile-dropdown")
const navMenu = document.getElementById("menu")
const navItems = document.querySelectorAll(".navitem")
const closeBtn = document.getElementById("close")
const mobileSideNav = document.getElementById("navbar")
const desktopSideNav = document.getElementById("desktop-nav")
const searchIcon = document.getElementById("search-icon")
const closeSearchBar = document.getElementById("close-search")
const clearSearchBar = document.getElementById("mobile-clear")
const mobileSearchBar = document.getElementById("mobile-search")
const mobileSearchInput = document.getElementById("mobile-search-input")
const thumbs = document.querySelectorAll(".thumbs")
const playIcons = document.querySelectorAll('.image-overlay > span');
const subscription = document.getElementById("subscription")
// const closeSubIcon = document.getElementById("close-sub")


function clearInputField(input, icon) {
    input.value = ""
    icon.style.display = "none"
    input.focus()
}

// clearing the search fields
clearSearchField.addEventListener("click", () => clearInputField(searchInput, clearSearchField))
// mobile
clearSearchBar.addEventListener("click", () => clearInputField(mobileSearchInput, clearSearchBar))

// showing the cancel icon when there is input
searchInput.addEventListener('input', () => {
    if (searchInput.value.length > 0) {
        clearSearchField.style.display = 'block';
    } else {
        clearSearchField.style.display = 'none';
    }
});

// shows the cancel icon when there's input
mobileSearchInput.addEventListener('input', () => {
    if (mobileSearchInput.value.length > 0) {
        clearSearchBar.style.display = 'block';
    } else {
        clearSearchBar.style.display = 'none';
    }
});

// Profile Dropdown Menu
profilePicture.addEventListener("click", () => DisplayDiv(profileDropDown))

// opens and closes the mobile Search Bar when the search icon is clicked
searchIcon.addEventListener("click", () => DisplayDiv(mobileSearchBar))
closeSearchBar.addEventListener("click", () => DisplayDiv(mobileSearchBar))

function DisplayDiv(div) {
    if (div.classList.contains("hide")) {
        div.classList.remove('hide');
        div.classList.add('show');
    } else {
        div.classList.remove('show');
        div.classList.add('hide');
    }
}

// Toggling the active class on the nav items
navItems.forEach(navItem => {   //change this to a function
    navItem.addEventListener('click', function() {
      // Remove active class from all items
        navItems.forEach(i =>  i.classList.remove('active'));

      // Add active class to the clicked item
        this.classList.add('active');
    })
})

console.log("dsjkldjjjl");

navMenu.addEventListener("click", () => DisplayDiv(mobileSideNav))
navMenu.addEventListener("click", () => DisplayDiv(desktopSideNav))


// SCROLLING
const scrollAmount = 400;
const scrollContainer = document.getElementById('content-01');
const scrollArtist = document.getElementById('artist-content');
const scrollCategory = document.getElementById('category-content');
const arrowRight = document.getElementById('arrow-right');
const arrowRight1 = document.querySelector('.arrow-right-1');
const arrowLeft = document.getElementById('arrow-left');
const arrowLeft1 = document.querySelector('.arrow-left-1');

document.querySelectorAll('.scroll-container').forEach(container => {
    const leftArrow = container.querySelector('.arrow-left');
    const rightArrow = container.querySelector('.arrow-right');
    const scrollContent = container.querySelector('.scroll-content');

    if (leftArrow && rightArrow && scrollContent) {
        leftArrow.addEventListener('click', () => ScrollLeft(scrollContent));
        rightArrow.addEventListener('click', () => ScrollRight(scrollContent));
    }
});

function ScrollLeft (container) {
    container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
    });
}

function ScrollRight (container) {
    container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

arrowLeft1.addEventListener('click', () => {
    ScrollLeft(scrollContainer)
})

arrowRight1.addEventListener('click', () => {
    ScrollRight(scrollContainer)
})


// moving to a new page when the song title is clicked
document.querySelectorAll('.song-title').forEach(title => {
    title.addEventListener('click', event => {
        event.preventDefault(); // Prevent default link behavior

        // Get song details from data attributes
        const song_title = event.target.getAttribute('data-song');
        const artist = event.target.getAttribute('data-artist');
        const src = event.target.getAttribute('data-src');
        const image = event.target.getAttribute('data-image');

        // Store song details in localStorage
        localStorage.setItem('currentSong', JSON.stringify({ song_title, artist, src, image }));

        // Redirect to the new page
        window.location.href = 'Song-Title.html'; // Change this to your target page
    });
});

// storing  minister information in local storage
document.querySelectorAll('.ministry').forEach(minister => {
    minister.addEventListener('click', event => {
        event.preventDefault(); // Prevent default link behavior

        // Get minister details from data attributes using event.currentTarget
        const ministerName = event.currentTarget.getAttribute('data-minister');
        const ministerImage = event.currentTarget.getAttribute('data-ministerImg');

        // Store song details in localStorage
        localStorage.setItem('minister', JSON.stringify({ ministerName, ministerImage }));

        // Redirect to the new page
        window.location.href = 'Minister.html';
    });
});


// EVENT SLIDE
let slideIndex = 0
showSlides()

function showSlides() {
    let i;
    let slides = document.getElementsByClassName('event')

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 3000); // Change image every 2 seconds
}

console.log(thumbs);  // Check if this logs the correct elements

thumbs.forEach(thumb => {
    thumb.addEventListener('click', function() {
        console.log('Thumb clicked:', this);  // Check if this logs the clicked element
        thumbs.forEach(i => {
            i.classList.remove("fa-solid");
            i.classList.add("fa-regular");
        });

        this.classList.toggle("fa-solid")

        // if (this.classList.contains("fa-regular")) {
        //    this.classList.remove("fa-regular");
        //    this.classList.add("fa-solid");
        // } else {
        //    this.classList.remove("fa-solid");
        //    this.classList.add("fa-regular");
        // }
    });
});