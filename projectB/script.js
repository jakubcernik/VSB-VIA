(() => {

    // Slider
    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;
    let slideInterval;

    function initSlider() {
        const sliderSection = document.querySelector('.slider');
        if (!sliderSection) return;

        slides[currentIndex].classList.add('active');

        document.querySelector('.next-btn').addEventListener('click', showNextImage);
        document.querySelector('.prev-btn').addEventListener('click', showPrevImage);

        slides.forEach((slide, idx) => {
            const link = slide.querySelector('a');
            link.addEventListener('click', (event) => {
                if (idx !== currentIndex) {
                    event.preventDefault();
                }
            });
        });

        slideInterval = setInterval(showNextImage, 10000);
    }

    function showNextImage() {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add('active');
        resetInterval();
    }

    function showPrevImage() {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        slides[currentIndex].classList.add('active');
        resetInterval();
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(showNextImage, 5000);
    }

    // Date Time
    function initDateTime() {
        const datetimeElement = document.getElementById('datetime');
        if (!datetimeElement) return;

        function updateDateTime() {
            const now = new Date();
            datetimeElement.textContent = now.toLocaleString();
        }

        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    // Account Dropdown Menu
    function initAccountDropdown() {
        const accountContainer = document.querySelector('.account-container');
        const dropdownMenu = document.querySelector('.dropdown-menu');

        if (accountContainer && dropdownMenu) {
            accountContainer.addEventListener('mouseenter', () => {
                dropdownMenu.style.display = 'block';
            });

            accountContainer.addEventListener('mouseleave', () => {
                dropdownMenu.style.display = 'none';
            });
        }
    }

    // Filter Button
    function initFilterButton() {
        const filterBtn = document.querySelector('.filter-btn');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                window.location.href = 'filter.html';
            });
        }
    }

    // Initialize All
    function init() {
        initSlider();
        initDateTime();
        initAccountDropdown();
        initFilterButton();
    }

    init();
})();
