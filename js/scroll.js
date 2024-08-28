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