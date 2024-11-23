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

// Add event listeners to Lightbox links
slides.forEach((slide, idx) => {
    const link = slide.querySelector('a');
    link.addEventListener('click', (event) => {
        if (idx !== index) {
            event.preventDefault(); // Prevent Lightbox from opening wrong image
        }
    });
});


function resetInterval() {
    clearInterval(interval);
    interval = setInterval(showNextImage, 10000);
}

function updateDateTime() {
    const now = new Date();
    document.getElementById('datetime').textContent = now.toLocaleString();
}

// Call the function to update the date and time every second
setInterval(updateDateTime, 1000);

// Initial call to display the date and time immediately when the page loads
updateDateTime();

const sliderSection = document.querySelector('.slider');
if (sliderSection) {
    document.querySelector('.next-btn').addEventListener('click', showNextImage);
    document.querySelector('.prev-btn').addEventListener('click', showPrevImage);
    // Initialize the first slide as active
    slides[index].classList.add('active');
}


const accountContainer = document.querySelector('.account-container');
const dropdownMenu = document.querySelector('.dropdown-menu');

// Show the dropdown when hovering over the container
accountContainer.addEventListener('mouseenter', () => {
    dropdownMenu.style.display = 'block';
});

// Hide the dropdown when the mouse leaves the container
accountContainer.addEventListener('mouseleave', () => {
    dropdownMenu.style.display = 'none';
});


document.querySelector('.filter-btn').addEventListener('click', function() {
    window.location.href = 'filter.html';
});

interval = setInterval(showNextImage, 10000); // Change every 10 seconds



