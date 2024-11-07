const slides = document.querySelectorAll('.slide');
let index = 0;

function showNextImage() {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
}

function showPrevImage() {
    slides[index].classList.remove('active');
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add('active');
}

document.querySelector('.next-btn').addEventListener('click', showNextImage);
document.querySelector('.prev-btn').addEventListener('click', showPrevImage);

setInterval(showNextImage, 10000); // Change every 10 seconds

// Initialize the first slide as active
slides[index].classList.add('active');