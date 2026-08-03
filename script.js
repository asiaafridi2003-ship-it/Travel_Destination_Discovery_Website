// --- Week 2 Expanded Destination Data Array ---
const destinations = [
    {
        id: 1,
        name: "Maldives Atolls",
        country: "Maldives",
        category: "Beaches",
        rating: 4.9,
        reviews: 320,
        description: "Experience luxury overwater bungalows, crystal-clear turquoise waters, and thriving marine life.",
        highlights: ["Snorkeling", "Overwater Villas", "Sunset Cruises"],
        bestTime: "Nov - Apr",
        estCost: "$1,500 - $3,000",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Swiss Alps",
        country: "Switzerland",
        category: "Mountains",
        rating: 4.8,
        reviews: 210,
        description: "Explore majestic snowy peaks, world-famous ski trails, and quaint alpine villages.",
        highlights: ["Skiing", "Cable Cars", "Mountain Hiking"],
        bestTime: "Dec - Mar / Jun - Sep",
        estCost: "$1,200 - $2,500",
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "Roman Colosseum",
        country: "Italy",
        category: "Historical",
        rating: 4.7,
        reviews: 450,
        description: "Immerse yourself in ancient Roman history, famous architectural marvels, and authentic cuisine.",
        highlights: ["Guided Tours", "Ancient Ruins", "Italian Gastronomy"],
        bestTime: "Apr - May / Sep - Oct",
        estCost: "$800 - $1,800",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        name: "Queenstown Skydive",
        country: "New Zealand",
        category: "Adventure",
        rating: 4.9,
        reviews: 180,
        description: "The global adventure capital for skydiving, white-water rafting, and bungee jumping.",
        highlights: ["Skydiving", "Bungee Jumping", "Lake Cruises"],
        bestTime: "Dec - Feb",
        estCost: "$1,000 - $2,200",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        name: "Kyoto Gardens & Shrines",
        country: "Japan",
        category: "Cultural",
        rating: 4.8,
        reviews: 290,
        description: "Discover peaceful Zen temples, traditional tea ceremonies, and gorgeous cherry blossoms.",
        highlights: ["Cherry Blossoms", "Historic Shrines", "Tea Ceremonies"],
        bestTime: "Mar - May / Oct - Nov",
        estCost: "$1,100 - $2,300",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        name: "Serengeti Wildlife Safari",
        country: "Tanzania",
        category: "Nature",
        rating: 4.9,
        reviews: 150,
        description: "Witness the Great Wildebeest Migration and encounter Africa's legendary Big Five animals.",
        highlights: ["Game Drives", "Hot Air Ballooning", "Wildlife Photography"],
        bestTime: "Jun - Oct",
        estCost: "$2,000 - $4,500",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80"
    }
];

// --- Persistent Favorites State ---
let savedFavorites = JSON.parse(localStorage.getItem('wanderlust_favs')) || [];

// --- DOM References ---
const destinationsGrid = document.getElementById('destinationsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
const favCountEl = document.getElementById('favCount');

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
        destinationsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fa-solid fa-compass" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 15px;"></i>
                <h3>No destinations match your criteria</h3>
                <p style="color: var(--text-muted);">Try adjusting your search terms or category filters.</p>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const isFav = savedFavorites.includes(item.id);
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${item.image}" alt="${item.name}">
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${item.id})">
                    <i class="fa-solid fa-heart"></i>
                </button>
            </div>
            <div class="card-body">
                <span class="category-tag">${item.category}</span>
                <div class="card-header">
                    <h3>${item.name}</h3>
                    <span class="rating"><i class="fa-solid fa-star"></i> ${item.rating}</span>
                </div>
                <p class="location"><i class="fa-solid fa-location-dot"></i> ${item.country}</p>
                <p>${item.description}</p>
                <button class="btn btn-primary" onclick="openModal(${item.id})">View Details</button>
            </div>
        `;
        destinationsGrid.appendChild(card);
    });
    
    updateFavCount();
}

// Initial Call
renderDestinations(destinations);

// --- 2. Local Storage Favorites System ---
window.toggleFavorite = function(id) {
    if (savedFavorites.includes(id)) {
        savedFavorites = savedFavorites.filter(favId => favId !== id);
    } else {
        savedFavorites.push(id);
    }
    localStorage.setItem('wanderlust_favs', JSON.stringify(savedFavorites));
    filterData(); // Refresh list display
};

function updateFavCount() {
    favCountEl.textContent = savedFavorites.length;
}

// --- 3. Filtering & Searching ---
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterData();
    });
});

// Category Card Quick Jump
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const cat = card.getAttribute('data-category');
        document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-filter') === cat) btn.click();
        });
    });
});

searchInput.addEventListener('input', filterData);

function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-filter');

    const filtered = destinations.filter(item => {
        const matchesCat = (activeCategory === 'All') || (item.category === activeCategory);
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                              item.country.toLowerCase().includes(searchTerm);
        return matchesCat && matchesSearch;
    });

    renderDestinations(filtered);
}

// --- 4. Interactive Destination Details Modal ---
window.openModal = function(id) {
    const item = destinations.find(d => d.id === id);
    if (!item) return;

    modalBody.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 260px; object-fit: cover; border-radius: 8px;">
        <h2 style="margin-top: 15px; color: var(--dark-color);">${item.name}</h2>
        <p style="color: var(--primary-color); font-weight: 600;"><i class="fa-solid fa-location-dot"></i> ${item.country} | Category: ${item.category}</p>
        
        <div class="modal-highlights">
            ${item.highlights.map(h => `<span class="highlight-pill"><i class="fa-solid fa-check" style="color:var(--primary-color);"></i> ${h}</span>`).join('')}
        </div>

        <p style="margin: 15px 0;">${item.description}</p>
        
        <div class="info-grid">
            <div>
                <strong>Best Time to Visit:</strong>
                <p>${item.bestTime}</p>
            </div>
            <div>
                <strong>Estimated Budget:</strong>
                <p>${item.estCost}</p>
            </div>
        </div>

        <button class="btn btn-primary" style="width: 100%; margin-top: 10px;" onclick="closeModalFunc()">Book Experience</button>
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

// --- 5. Navigation & Carousel Controls ---
hamburgerBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

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
setInterval(nextSlide, 5000);