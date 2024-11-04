const slides = document.querySelector('.slides');
const images = slides.querySelectorAll('img');
let index = 0;

function showNextImage() {
    index = (index + 1) % images.length;
    slides.style.transform = `translateX(${-index * 100}%)`;
}

setInterval(showNextImage, 5000); // Změna každé 3 sekundy
