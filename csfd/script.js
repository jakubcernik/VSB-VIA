const slides = document.querySelectorAll('.slide');
let index = 0;
let interval;

function showNextImage() {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
    resetInterval();
}

function showPrevImage() {
    slides[index].classList.remove('active');
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add('active');
    resetInterval();
}

function resetInterval() {
    clearInterval(interval);
    interval = setInterval(showNextImage, 10000);
}

document.querySelector('.next-btn').addEventListener('click', showNextImage);
document.querySelector('.prev-btn').addEventListener('click', showPrevImage);

document.querySelector('.account-btn').addEventListener('mouseenter', function() {
    document.querySelector('.dropdown-menu').style.display = 'block';
});

document.querySelector('.account-btn').addEventListener('mouseleave', function() {
    document.querySelector('.dropdown-menu').style.display = 'none';
});

document.querySelector('.filter-btn').addEventListener('click', function() {
    window.location.href = 'filter.html';
});

interval = setInterval(showNextImage, 10000); // Change every 10 seconds

// Initialize the first slide as active
slides[index].classList.add('active');