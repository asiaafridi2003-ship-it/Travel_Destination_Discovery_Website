// --- Destination Data Array ---
const destinations = [
    {
        id: 1,
        name: "Maldives Atolls",
        country: "Maldives",
        category: "Beaches",
        description: "Experience serene crystal-clear waters, luxury overwater bungalows, and vibrant coral reefs.",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Swiss Alps",
        country: "Switzerland",
        category: "Mountains",
        description: "Breathtaking mountain peaks, world-class skiing, and tranquil alpine villages.",
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Colosseum",
        country: "Italy",
        category: "Historical",
        description: "Walk through ancient history and experience the legendary architectural triumph of Rome.",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Queenstown Skydiving",
        country: "New Zealand",
        category: "Adventure",
        description: "The ultimate destination for adrenaline junkies, skydiving, and bungee jumping.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Kyoto Temples",
        country: "Japan",
        category: "Cultural",
        description: "Immerse in Japanese tradition with centuries-old shrines, gardens, and tea ceremonies.",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Serengeti Safari",
        country: "Tanzania",
        category: "Nature",
        description: "Witness the Great Migration and encounter majestic wildlife in their natural habitat.",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80"
    }
];

// --- DOM Elements ---
const destinationsGrid = document.getElementById('destinationsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');

const modal = document.getElementById('detailsModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

const slides = document.querySelectorAll('.slide');
const prevSlideBtn = document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextSlide');

// --- 1. Dynamic Rendering of Destinations ---
function renderDestinations(items) {
    destinationsGrid.innerHTML = '';
    
    if (items.length === 0) {
        destinationsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">No destinations found.</p>`;
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="card-body">
                <h3>${item.name}</h3>
                <p class="location"><i class="fa-solid fa-location-dot"></i> ${item.country}</p>
                <p>${item.description}</p>
                <button class="btn btn-primary" onclick="openModal(${item.id})">Explore Details</button>
            </div>
        `;
        destinationsGrid.appendChild(card);
    });
}

// Initial Render
renderDestinations(destinations);

// --- 2. Category Filter Interaction ---
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active class
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');
        filterData();
    });
});

// Category cards click interaction
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const selectedCat = card.getAttribute('data-category');
        
        // Scroll to section
        document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
        
        // Trigger filter button active state
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-filter') === selectedCat) {
                btn.click();
            }
        });
    });
});

// --- 3. Search Functionality ---
searchInput.addEventListener('input', filterData);

function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-filter');

    const filtered = destinations.filter(item => {
        const matchesCategory = (activeCategory === 'All') || (item.category === activeCategory);
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                              item.country.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    renderDestinations(filtered);
}

// --- 4. Mobile Navigation Menu Toggle ---
hamburgerBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close nav when clicking link on mobile
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// --- 5. Image Carousel Slider ---
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) slide.classList.add('active');
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

nextSlideBtn.addEventListener('click', nextSlide);
prevSlideBtn.addEventListener('click', prevSlide);

// Auto-advance slider every 5 seconds
setInterval(nextSlide, 5000);

// --- 6. Modal / Details Button Interaction ---
window.openModal = function(id) {
    const item = destinations.find(d => d.id === id);
    if (!item) return;

    modalBody.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 100%; border-radius: 8px; margin-bottom: 15px;">
        <h2>${item.name}</h2>
        <p style="color: var(--primary-color); font-weight: 600; margin-bottom: 10px;">Category: ${item.category} | ${item.country}</p>
        <p>${item.description}</p>
        <button class="btn btn-primary" style="margin-top: 20px; width: 100%;" onclick="closeModalFunc()">Book Experience</button>
    `;
    modal.style.display = 'flex';
};

function closeModalFunc() {
    modal.style.display = 'none';
}

closeModal.addEventListener('click', closeModalFunc);
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFunc();
});