// --- Destination Data Array ---
const destinations = [
    {
        id: 1,
        name: "Maldives Atolls",
        country: "Maldives",
        category: "Beaches",
        rating: 4.9,
        description: "Experience luxury overwater bungalows, crystal-clear turquoise waters, and thriving marine life.",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Swiss Alps",
        country: "Switzerland",
        category: "Mountains",
        rating: 4.8,
        description: "Explore majestic snowy peaks, world-famous ski trails, and quaint alpine villages.",
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "Roman Colosseum",
        country: "Italy",
        category: "Historical",
        rating: 4.7,
        description: "Immerse yourself in ancient Roman history, famous architectural marvels, and authentic cuisine.",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        name: "Queenstown Skydive",
        country: "New Zealand",
        category: "Adventure",
        rating: 4.9,
        description: "The global adventure capital for skydiving, white-water rafting, and bungee jumping.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        name: "Kyoto Gardens & Shrines",
        country: "Japan",
        category: "Cultural",
        rating: 4.8,
        description: "Discover peaceful Zen temples, traditional tea ceremonies, and gorgeous cherry blossoms.",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        name: "Serengeti Wildlife Safari",
        country: "Tanzania",
        category: "Nature",
        rating: 4.9,
        description: "Witness the Great Wildebeest Migration and encounter Africa's legendary Big Five animals.",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80"
    }
];

// --- Persistent State Variables (LocalStorage) ---
let savedFavorites = JSON.parse(localStorage.getItem('wanderlust_favs')) || [1];
let recentlyViewed = JSON.parse(localStorage.getItem('wanderlust_recent')) || [];
let userProfile = JSON.parse(localStorage.getItem('wanderlust_profile')) || {
    name: "Asia Bibi",
    bio: "Software engineering student with a passion for discovering world cultures and coastal landmarks.",
    trips: 3
};

// --- DOM References ---
const destinationsGrid = document.getElementById('destinationsGrid');
const favoritesGrid = document.getElementById('favoritesGrid');
const recentlyViewedGrid = document.getElementById('recentlyViewedGrid');
const recommendationsGrid = document.getElementById('recommendationsGrid');

const navFavCount = document.getElementById('navFavCount');
const quickFavCount = document.getElementById('quickFavCount');
const profileFavCount = document.getElementById('profileFavCount');

const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');

const detailsModal = document.getElementById('detailsModal');
const modalBody = document.getElementById('modalBody');
const closeDetailsModal = document.getElementById('closeModal');

const profileModal = document.getElementById('profileModal');
const editProfileBtn = document.getElementById('editProfileBtn');
const closeProfileModal = document.getElementById('closeProfileModal');
const editProfileForm = document.getElementById('editProfileForm');

// --- 1. Notification Toast Helper ---
function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// --- 2. Render Cards Helper Function ---
function createCardHTML(item, showRemoveBtn = false) {
    const isFav = savedFavorites.includes(item.id);
    return `
        <div class="card">
            <div class="card-img-wrapper">
                <img src="${item.image}" alt="${item.name}">
                ${showRemoveBtn ? 
                    `<button class="fav-btn active" onclick="toggleFavorite(${item.id})" title="Remove Favorite"><i class="fa-solid fa-trash"></i></button>` :
                    `<button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${item.id})" title="Toggle Favorite"><i class="fa-solid fa-heart"></i></button>`
                }
            </div>
            <div class="card-body">
                <h3>${item.name}</h3>
                <p class="location"><i class="fa-solid fa-location-dot"></i> ${item.country}</p>
                <p>${item.description}</p>
                <button class="btn btn-primary btn-sm" onclick="openDetailsModal(${item.id})">View Details</button>
            </div>
        </div>
    `;
}

// --- 3. Render All Dashboard & Directory Views ---
function updateUI() {
    // Sync Favorite Counts
    const count = savedFavorites.length;
    navFavCount.textContent = count;
    quickFavCount.textContent = count;
    profileFavCount.textContent = count;

    // Render Favorites Section
    const favItems = destinations.filter(d => savedFavorites.includes(d.id));
    if (favItems.length === 0) {
        favoritesGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No saved favorites yet. Explore places below to bookmark them!</p>`;
    } else {
        favoritesGrid.innerHTML = favItems.map(item => createCardHTML(item, true)).join('');
    }

    // Render Recently Viewed Widget
    const recentItems = destinations.filter(d => recentlyViewed.includes(d.id));
    if (recentItems.length === 0) {
        recentlyViewedGrid.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-muted);">No recent views. Click 'View Details' on any destination to track history.</p>`;
    } else {
        recentlyViewedGrid.innerHTML = recentItems.map(item => createCardHTML(item)).join('');
    }

    // Render Popular Recommendations Widget (e.g. destinations with rating >= 4.8)
    const recommended = destinations.filter(d => d.rating >= 4.8).slice(0, 3);
    recommendationsGrid.innerHTML = recommended.map(item => createCardHTML(item)).join('');

    // Render Main Directory
    filterData();
}

// --- 4. Favorite Toggle Function ---
window.toggleFavorite = function(id) {
    const item = destinations.find(d => d.id === id);
    if (savedFavorites.includes(id)) {
        savedFavorites = savedFavorites.filter(favId => favId !== id);
        showToast(`Removed "${item.name}" from favorites`);
    } else {
        savedFavorites.push(id);
        showToast(`Saved "${item.name}" to favorites!`);
    }

    localStorage.setItem('wanderlust_favs', JSON.stringify(savedFavorites));
    updateUI();
};

// --- 5. Modal & Recent Activity Handler ---
window.openDetailsModal = function(id) {
    const item = destinations.find(d => d.id === id);
    if (!item) return;

    // Record in Recently Viewed
    if (!recentlyViewed.includes(id)) {
        recentlyViewed.unshift(id);
        if (recentlyViewed.length > 4) recentlyViewed.pop(); // Keep max 4
        localStorage.setItem('wanderlust_recent', JSON.stringify(recentlyViewed));
    }

    modalBody.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width:100%; height:220px; object-fit:cover; border-radius:8px;">
        <h2 style="margin-top:15px;">${item.name}</h2>
        <p style="color:var(--primary-color); font-weight:600;"><i class="fa-solid fa-location-dot"></i> ${item.country} | Category: ${item.category}</p>
        <p style="margin: 15px 0;">${item.description}</p>
        <button class="btn btn-primary" style="width:100%;" onclick="closeDetailsModalFunc()">Done Exploring</button>
    `;
    detailsModal.style.display = 'flex';
    updateUI();
};

function closeDetailsModalFunc() { detailsModal.style.display = 'none'; }
closeDetailsModal.addEventListener('click', closeDetailsModalFunc);

// --- 6. User Profile System ---
function loadProfileData() {
    document.getElementById('profileNameDisplay').textContent = userProfile.name;
    document.getElementById('profileBioDisplay').textContent = userProfile.bio;
    document.getElementById('profileTripsCount').textContent = userProfile.trips;
}

editProfileBtn.addEventListener('click', () => {
    document.getElementById('inputName').value = userProfile.name;
    document.getElementById('inputBio').value = userProfile.bio;
    document.getElementById('inputTrips').value = userProfile.trips;
    profileModal.style.display = 'flex';
});

closeProfileModal.addEventListener('click', () => { profileModal.style.display = 'none'; });

editProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userProfile.name = document.getElementById('inputName').value;
    userProfile.bio = document.getElementById('inputBio').value;
    userProfile.trips = document.getElementById('inputTrips').value;

    localStorage.setItem('wanderlust_profile', JSON.stringify(userProfile));
    loadProfileData();
    profileModal.style.display = 'none';
    showToast('Profile information updated successfully!');
});

// --- 7. Search & Filter Functionality ---
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterData();
    });
});

searchInput.addEventListener('input', filterData);

function filterData() {
    const term = searchInput.value.toLowerCase();
    const activeCat = document.querySelector('.filter-btn.active').getAttribute('data-filter');

    const filtered = destinations.filter(item => {
        const matchesCat = (activeCat === 'All') || (item.category === activeCat);
        const matchesSearch = item.name.toLowerCase().includes(term) || item.country.toLowerCase().includes(term);
        return matchesCat && matchesSearch;
    });

    destinationsGrid.innerHTML = filtered.map(item => createCardHTML(item)).join('');
}

// Mobile Navbar Toggle
document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

// Initial Setup
loadProfileData();
updateUI();