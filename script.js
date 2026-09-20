// --- 1. DATA REPOSITORIES ---
const destinationsData = [
    {
        id: 101,
        name: "Hunza Valley",
        location: "Gilgit-Baltistan",
        type: "Adventure",
        budgetTier: "Medium",
        cost: "$120 / day",
        duration: "5 Days",
        rating: 4.9,
        environment: "Mountains",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        description: "Breathtaking mountain valley known for Altit Fort, Passu Cones, and turquoise Attabad Lake.",
        activities: ["Trekking", "Fort Exploration", "Boating", "Photography"]
    },
    {
        id: 102,
        name: "Skardu & Deosai",
        location: "Gilgit-Baltistan",
        type: "Adventure",
        budgetTier: "Medium",
        cost: "$140 / day",
        duration: "7 Days",
        rating: 5.0,
        environment: "Mountains",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        description: "Gateway to world's highest peaks, Shangrila Resort, Katpana Cold Desert, and Deosai Plateau.",
        activities: ["Wilderness Camping", "Desert Safari", "Lakeside Boating"]
    },
    {
        id: 103,
        name: "Swat Valley & Kalam",
        location: "Khyber Pakhtunkhwa",
        type: "Family",
        budgetTier: "Budget",
        cost: "$70 / day",
        duration: "4 Days",
        rating: 4.7,
        environment: "Mountains",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        description: "Lush green alpine valleys, scenic Mahodand Lake, and Malam Jabba chairlifts.",
        activities: ["Skiing", "Chairlift Rides", "River Rafting", "Sightseeing"]
    },
    {
        id: 104,
        name: "Lahore Heritage Trail",
        location: "Punjab",
        type: "Cultural",
        budgetTier: "Budget",
        cost: "$50 / day",
        duration: "3 Days",
        rating: 4.8,
        environment: "Historical",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        description: "Rich historical Mughal architecture including Badshahi Mosque, Lahore Fort, and food streets.",
        activities: ["Heritage Walks", "Culinary Tours", "Museum Visits"]
    }
];

const servicesData = [
    { id: 301, title: "4x4 Mountain Safari", provider: "Karakoram Expeditions", price: "$90 / day", icon: "fa-car" },
    { id: 302, title: "Luxury Valley Resort", provider: "Shangrila Hotels", price: "$150 / night", icon: "fa-hotel" },
    { id: 303, title: "Certified Trekking Guide", provider: "Alpine Trekking Co.", price: "$45 / day", icon: "fa-user-ninja" }
];

let initialReviews = [
    { id: 1, author: "Ali Khan", destination: "Hunza Valley", rating: 5, comment: "Passu Cones and Attabad Lake were unforgettable!" },
    { id: 2, author: "Sara Ahmed", destination: "Lahore", rating: 5, comment: "Amazing food and historic architecture tours." }
];

// --- 2. UTILITY & TOAST NOTIFICATION ---
function showToast(msg) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
}

// --- 3. THEME TOGGLE (DARK / LIGHT) ---
const themeToggleBtn = document.getElementById('themeToggleBtn');
const htmlEl = document.documentElement;

const savedTheme = localStorage.getItem('wanderlust_theme') || 'light';
htmlEl.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('wanderlust_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode.`);
});

function updateThemeIcon(theme) {
    themeToggleBtn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

// --- 4. EXPLORE DESTINATIONS MODULE (SEARCH & FILTER) ---
const destinationsGrid = document.getElementById('destinationsGrid');
const searchInput = document.getElementById('searchInput');
const filterStyle = document.getElementById('filterStyle');
const filterBudget = document.getElementById('filterBudget');

function renderDestinations() {
    const q = searchInput.value.toLowerCase();
    const style = filterStyle.value;
    const budget = filterBudget.value;

    const filtered = destinationsData.filter(item => {
        const matchesQuery = item.name.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
        const matchesStyle = style === 'All' || item.type === style;
        const matchesBudget = budget === 'All' || item.budgetTier === budget;
        return matchesQuery && matchesStyle && matchesBudget;
    });

    if (filtered.length === 0) {
        destinationsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">No destinations matched your criteria.</p>`;
        return;
    }

    destinationsGrid.innerHTML = filtered.map(item => `
        <div class="card shadow-sm">
            <div class="card-img-box">
                <img src="${item.image}" alt="${item.name}">
                <span class="card-badge">${item.type}</span>
            </div>
            <div class="card-body">
                <h4>${item.name}</h4>
                <p class="card-location"><i class="fa-solid fa-location-dot"></i> ${item.location}</p>
                <p class="card-desc">${item.description}</p>
                <div class="card-footer">
                    <span><i class="fa-solid fa-star" style="color:var(--accent-color);"></i> ${item.rating}</span>
                    <button class="btn btn-sm btn-primary" onclick="openDetailModal(${item.id})">Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

searchInput.addEventListener('input', renderDestinations);
filterStyle.addEventListener('change', renderDestinations);
filterBudget.addEventListener('change', renderDestinations);

// Modal Detail View
const detailModal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');

window.openDetailModal = function(id) {
    const dest = destinationsData.find(d => d.id === id);
    if (!dest) return;

    modalBody.innerHTML = `
        <h3 style="color:var(--dark-color); margin-bottom:10px;">${dest.name}</h3>
        <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:15px;"><i class="fa-solid fa-location-dot"></i> ${dest.location} • ${dest.duration}</p>
        <img src="${dest.image}" alt="${dest.name}" style="width:100%; height:220px; object-fit:cover; border-radius:8px; margin-bottom:15px;">
        <p style="margin-bottom:12px;">${dest.description}</p>
        <p><strong>Estimated Budget:</strong> ${dest.cost}</p>
        <p><strong>Activities:</strong> ${dest.activities.join(', ')}</p>
    `;
    detailModal.classList.add('active');
};

document.getElementById('modalCloseBtn').addEventListener('click', () => detailModal.classList.remove('active'));

// --- 5. SMART RECOMMENDATION ENGINE ---
const recommendationForm = document.getElementById('recommendationForm');
const recommendationsGrid = document.getElementById('recommendationsGrid');

function computeRecommendations() {
    const budget = document.getElementById('prefBudget').value;
    const type = document.getElementById('prefType').value;
    const duration = document.getElementById('prefDuration').value;
    const environment = document.getElementById('prefEnvironment').value;

    const scored = destinationsData.map(dest => {
        let score = 0;
        let reasons = [];

        if (dest.budgetTier === budget) { score += 30; reasons.push(`Matches ${budget} budget`); }
        if (dest.type === type) { score += 30; reasons.push(`Fits ${type} travel style`); }
        if (dest.environment === environment) { score += 25; reasons.push(`Matches ${environment} environment`); }
        
        return { ...dest, score, matchReason: reasons.join(' • ') };
    }).sort((a, b) => b.score - a.score);

    recommendationsGrid.innerHTML = scored.map(dest => `
        <div class="card shadow-sm">
            <div class="card-img-box">
                <img src="${dest.image}" alt="${dest.name}">
                <span class="card-badge">${dest.score}% Match</span>
            </div>
            <div class="card-body">
                <h4>${dest.name}</h4>
                <p class="card-location"><i class="fa-solid fa-location-dot"></i> ${dest.location}</p>
                <div style="background:var(--bg-light); border-left:3px solid var(--primary-color); padding:8px 10px; border-radius:6px; font-size:0.8rem; margin-bottom:12px;">
                    <strong>Why Recommended:</strong> ${dest.matchReason || 'Popular choice'}
                </div>
                <div class="card-footer">
                    <strong>${dest.cost}</strong>
                    <span><i class="fa-solid fa-star" style="color:var(--accent-color);"></i> ${dest.rating}</span>
                </div>
            </div>
        </div>
    `).join('');
}

recommendationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    computeRecommendations();
    showToast('Updated personalized recommendations.');
});

// --- 6. INTERACTIVE TRAVEL ASSISTANT ---
const assistantKnowledge = {
    budget: "<h5><i class='fa-solid fa-wallet'></i> Budget Advice</h5><p>Swat Valley and Lahore offer excellent budget choices under $70/day with accessible local transit and options.</p>",
    family: "<h5><i class='fa-solid fa-people-roof'></i> Family Recommendations</h5><p>Shangrila Skardu and Swat Kalam provide family resorts, gentle walking paths, and comfortable amenities.</p>",
    adventure: "<h5><i class='fa-solid fa-person-hiking'></i> Adventure Guides</h5><p>Hunza Valley and Deosai Plateau feature world-class trekking passes and high-altitude camping itineraries.</p>",
    packing: "<h5><i class='fa-solid fa-suitcase'></i> Essential Mountain Packing</h5><p>Pack thermal layers, windproof jackets, high SPF sunscreen, mountain footwear, and emergency cash reserves.</p>",
    besttime: "<h5><i class='fa-solid fa-calendar-day'></i> Optimal Seasons</h5><p>April-May for Blossom, June-August for High-Pass Trekking, and October-November for Autumn Foliage.</p>"
};

const assistantBtns = document.querySelectorAll('.assistant-btn');
const assistantResponseBody = document.getElementById('assistantResponseBody');

assistantBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        assistantBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-query');
        assistantResponseBody.innerHTML = assistantKnowledge[key] || '';
    });
});
assistantResponseBody.innerHTML = assistantKnowledge['budget'];

// --- 7. SERVICES & BOOKING MODULE ---
const servicesGrid = document.getElementById('servicesGrid');
const bookingModal = document.getElementById('bookingModal');
const bookingModalBody = document.getElementById('bookingModalBody');

function renderServices() {
    servicesGrid.innerHTML = servicesData.map(s => `
        <div class="card shadow-sm" style="padding: 20px;">
            <i class="fa-solid ${s.icon}" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 10px;"></i>
            <h4>${s.title}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">${s.provider}</p>
            <strong style="margin: 10px 0; color: var(--primary-color);">${s.price}</strong>
            <button class="btn btn-sm btn-primary" onclick="openBookingModal('${s.title}')">Reserve Service</button>
        </div>
    `).join('');
}

window.openBookingModal = function(title) {
    bookingModalBody.innerHTML = `
        <h3>Reserve: ${title}</h3>
        <form id="confirmBookingForm" style="margin-top:15px;">
            <div class="form-group"><label>Full Name</label><input type="text" required></div>
            <div class="form-group"><label>Date</label><input type="date" required></div>
            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:10px;">Confirm Booking</button>
        </form>
    `;
    bookingModal.classList.add('active');
    
    document.getElementById('confirmBookingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        bookingModal.classList.remove('active');
        showToast(`Successfully booked ${title}!`);
    });
};

document.getElementById('bookingModalCloseBtn').addEventListener('click', () => bookingModal.classList.remove('active'));

// --- 8. COMMUNITY REVIEWS SYSTEM ---
const reviewsFeed = document.getElementById('reviewsFeed');
const reviewForm = document.getElementById('reviewForm');

function renderReviews() {
    reviewsFeed.innerHTML = initialReviews.map(r => `
        <div class="card shadow-sm" style="padding: 18px;">
            <div style="display:flex; justify-size:space-between; align-items:center; margin-bottom:8px;">
                <strong>${r.author}</strong>
                <span style="color:var(--accent-color);">${'★'.repeat(r.rating)}</span>
            </div>
            <small style="color:var(--text-muted);">${r.destination}</small>
            <p style="font-size:0.88rem; margin-top:8px;">"${r.comment}"</p>
        </div>
    `).join('');
}

reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newRev = {
        id: Date.now(),
        author: document.getElementById('revAuthor').value,
        destination: document.getElementById('revDestination').value,
        rating: parseInt(document.getElementById('revRating').value),
        comment: document.getElementById('revComment').value
    };
    initialReviews.unshift(newRev);
    renderReviews();
    reviewForm.reset();
    showToast('Thank you! Your review has been posted.');
});

// --- 9. LOCAL STORAGE TRIP PLANNER ---
const tripForm = document.getElementById('tripForm');
const savedTripsContainer = document.getElementById('savedTripsContainer');

function getStoredTrips() {
    return JSON.parse(localStorage.getItem('wanderlust_trips') || '[]');
}

function renderTrips() {
    const trips = getStoredTrips();
    if (trips.length === 0) {
        savedTripsContainer.innerHTML = `<p style="grid-column:1/-1; color:var(--text-muted);">No saved itineraries yet.</p>`;
        return;
    }
    savedTripsContainer.innerHTML = trips.map((t, index) => `
        <div class="card shadow-sm" style="padding: 18px;">
            <h4>${t.name}</h4>
            <p style="font-size:0.85rem; color:var(--text-muted);"><i class="fa-solid fa-location-dot"></i> ${t.destination} • ${t.days} Days</p>
            <button class="btn btn-sm" style="background:var(--danger-color); color:#fff; margin-top:10px;" onclick="deleteTrip(${index})">Remove</button>
        </div>
    `).join('');
}

tripForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTrip = {
        name: document.getElementById('tripName').value,
        destination: document.getElementById('tripDestination').value,
        days: document.getElementById('tripDays').value
    };
    const trips = getStoredTrips();
    trips.push(newTrip);
    localStorage.setItem('wanderlust_trips', JSON.stringify(trips));
    renderTrips();
    tripForm.reset();
    showToast('Itinerary saved to local storage!');
});

window.deleteTrip = function(index) {
    const trips = getStoredTrips();
    trips.splice(index, 1);
    localStorage.setItem('wanderlust_trips', JSON.stringify(trips));
    renderTrips();
    showToast('Itinerary removed.');
};

// Mobile Navigation Toggle
document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

// --- INITIALIZATIONS ---
renderDestinations();
computeRecommendations();
renderServices();
renderReviews();
renderTrips();