// --- Global Destination Data ---
const destinations = [
    { id: 1, name: "Maldives Atolls", country: "Maldives", category: "Beaches", description: "Experience luxury overwater bungalows and turquoise waters.", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80" },
    { id: 2, name: "Swiss Alps", country: "Switzerland", category: "Mountains", description: "Explore majestic snowy peaks and alpine trails.", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80" },
    { id: 3, name: "Roman Colosseum", country: "Italy", category: "Historical", description: "Immerse yourself in ancient Roman history and culture.", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80" },
    { id: 4, name: "Queenstown Skydive", country: "New Zealand", category: "Adventure", description: "The global adventure capital for thrill seekers.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" }
];

// --- Persistent State Variables ---
let currentTrip = JSON.parse(localStorage.getItem('wanderlust_trip')) || null;
let savedFavorites = JSON.parse(localStorage.getItem('wanderlust_favs')) || [1];
let recentlyViewed = JSON.parse(localStorage.getItem('wanderlust_recent')) || [];
let userProfile = JSON.parse(localStorage.getItem('wanderlust_profile')) || {
    name: "Asia Bibi",
    bio: "Software engineering student with a passion for discovering world cultures.",
    trips: 1
};

// --- Toast Helper ---
function showToast(msg) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- 1. TRIP PLANNER & ITINERARY CORE LOGIC ---

const tripForm = document.getElementById('tripForm');
const tripOverviewContainer = document.getElementById('tripOverviewContainer');
const itinerarySection = document.getElementById('itinerarySection');
const summarySection = document.getElementById('summarySection');
const daysContainer = document.getElementById('daysContainer');

// Date Calculation Helper
function calculateDaysDifference(startStr, endStr) {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = end - start;
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of start day
}

// Save & Create Trip Form Handler
tripForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('tripName').value.trim();
    const destination = document.getElementById('tripDestination').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const travelers = parseInt(document.getElementById('travelersCount').value);
    const description = document.getElementById('tripDescription').value.trim();

    // Form Validation: Chronological Dates
    if (new Date(startDate) > new Date(endDate)) {
        showToast("Error: End Date cannot be earlier than Start Date.");
        return;
    }

    const totalDays = calculateDaysDifference(startDate, endDate);

    // Build or preserve days array
    let daysArray = [];
    for (let i = 1; i <= totalDays; i++) {
        daysArray.push({ dayNumber: i, activities: [] });
    }

    currentTrip = {
        name,
        destination,
        startDate,
        endDate,
        travelers,
        description,
        totalDays,
        days: daysArray
    };

    saveAndRenderTrip();
    showToast("Trip plan created successfully!");
});

function saveAndRenderTrip() {
    if (!currentTrip) {
        tripOverviewContainer.style.display = 'none';
        itinerarySection.style.display = 'none';
        summarySection.style.display = 'none';
        return;
    }

    localStorage.setItem('wanderlust_trip', JSON.stringify(currentTrip));

    // Render Overview
    document.getElementById('overviewTitle').textContent = currentTrip.name;
    document.getElementById('overviewDestination').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${currentTrip.destination}`;
    document.getElementById('overviewDates').textContent = `${currentTrip.startDate} to ${currentTrip.endDate}`;
    document.getElementById('overviewDays').textContent = `${currentTrip.totalDays} Day(s)`;
    document.getElementById('overviewTravelers').textContent = `${currentTrip.travelers} Traveler(s)`;
    document.getElementById('overviewNotes').textContent = currentTrip.description ? `"${currentTrip.description}"` : '';

    // Calculate total scheduled activities
    const totalActs = currentTrip.days.reduce((acc, d) => acc + d.activities.length, 0);
    document.getElementById('overviewActivitiesCount').textContent = `${totalActs} Activity(ies)`;

    // Calculate Trip Status
    const today = new Date().toISOString().split('T')[0];
    const statusBadge = document.getElementById('overviewStatus');
    if (today < currentTrip.startDate) {
        statusBadge.textContent = 'Upcoming';
        statusBadge.className = 'badge badge-success';
    } else if (today >= currentTrip.startDate && today <= currentTrip.endDate) {
        statusBadge.textContent = 'In Progress';
        statusBadge.className = 'badge';
        statusBadge.style.background = '#fff3cd';
        statusBadge.style.color = '#664d03';
    } else {
        statusBadge.textContent = 'Completed';
        statusBadge.className = 'badge';
        statusBadge.style.background = '#e2e8f0';
        statusBadge.style.color = '#475569';
    }

    tripOverviewContainer.style.display = 'block';
    itinerarySection.style.display = 'block';
    summarySection.style.display = 'block';

    renderItineraryDays();
    renderTripSummary();
}

// Render Day-by-Day Cards
function renderItineraryDays() {
    daysContainer.innerHTML = '';

    currentTrip.days.forEach((dayObj, dIndex) => {
        const dayBox = document.createElement('div');
        dayBox.className = 'day-box';

        let activitiesHTML = '';
        if (dayObj.activities.length === 0) {
            activitiesHTML = `<p style="color:var(--text-muted); font-size:0.85rem; font-style:italic;">No activities scheduled for Day ${dayObj.dayNumber} yet.</p>`;
        } else {
            activitiesHTML = `<div class="activity-grid">` + dayObj.activities.map((act, aIndex) => `
                <div class="activity-card">
                    <span class="act-cat-tag">${act.category}</span>
                    <h5>${act.name}</h5>
                    <div class="activity-meta">
                        <span><i class="fa-solid fa-clock"></i> ${act.time}</span>
                        <span><i class="fa-solid fa-location-dot"></i> ${act.location}</span>
                    </div>
                    <p>${act.description}</p>
                    <div class="activity-actions">
                        <button class="btn btn-outline btn-sm" onclick="editActivity(${dIndex}, ${aIndex})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="deleteActivity(${dIndex}, ${aIndex})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `).join('') + `</div>`;
        }

        dayBox.innerHTML = `
            <div class="day-box-header">
                <h4>Day ${dayObj.dayNumber}</h4>
                <button class="btn btn-primary btn-sm" onclick="openActivityModal(${dIndex})">
                    <i class="fa-solid fa-plus"></i> Add Activity
                </button>
            </div>
            ${activitiesHTML}
        `;

        daysContainer.appendChild(dayBox);
    });
}

// Add Extra Day Dynamic Interaction
document.getElementById('addDayBtn').addEventListener('click', () => {
    if (!currentTrip) return;
    const nextDayNum = currentTrip.days.length + 1;
    currentTrip.days.push({ dayNumber: nextDayNum, activities: [] });
    currentTrip.totalDays = currentTrip.days.length;
    saveAndRenderTrip();
    showToast(`Added Day ${nextDayNum} to itinerary`);
});

// Reset Trip Handler
document.getElementById('resetTripBtn').addEventListener('click', () => {
    if (confirm("Are you sure you want to reset and clear this trip plan?")) {
        currentTrip = null;
        localStorage.removeItem('wanderlust_trip');
        saveAndRenderTrip();
        showToast("Trip plan reset.");
    }
});

// Activity Modal & Handlers
const activityModal = document.getElementById('activityModal');
const activityForm = document.getElementById('activityForm');

window.openActivityModal = function(dayIndex, editActIndex = null) {
    document.getElementById('actTargetDayIndex').value = dayIndex;
    document.getElementById('actEditIndex').value = editActIndex !== null ? editActIndex : '';
    
    if (editActIndex !== null) {
        const act = currentTrip.days[dayIndex].activities[editActIndex];
        document.getElementById('activityModalTitle').innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Activity`;
        document.getElementById('actName').value = act.name;
        document.getElementById('actLocation').value = act.location;
        document.getElementById('actTime').value = act.time;
        document.getElementById('actCategory').value = act.category;
        document.getElementById('actDescription').value = act.description;
    } else {
        document.getElementById('activityModalTitle').innerHTML = `<i class="fa-solid fa-calendar-plus"></i> Schedule Activity`;
        activityForm.reset();
    }
    
    activityModal.style.display = 'flex';
};

document.getElementById('closeActivityModal').addEventListener('click', () => { activityModal.style.display = 'none'; });

activityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const dIndex = parseInt(document.getElementById('actTargetDayIndex').value);
    const editIndex = document.getElementById('actEditIndex').value;

    const newActivity = {
        name: document.getElementById('actName').value.trim(),
        location: document.getElementById('actLocation').value.trim(),
        time: document.getElementById('actTime').value,
        category: document.getElementById('actCategory').value,
        description: document.getElementById('actDescription').value.trim()
    };

    if (editIndex !== '') {
        currentTrip.days[dIndex].activities[parseInt(editIndex)] = newActivity;
        showToast("Activity updated!");
    } else {
        currentTrip.days[dIndex].activities.push(newActivity);
        showToast("New activity scheduled!");
    }

    activityModal.style.display = 'none';
    saveAndRenderTrip();
});

window.editActivity = function(dIndex, aIndex) { openActivityModal(dIndex, aIndex); };

window.deleteActivity = function(dIndex, aIndex) {
    currentTrip.days[dIndex].activities.splice(aIndex, 1);
    saveAndRenderTrip();
    showToast("Activity removed.");
};

// Render Printable Final Trip Summary
function renderTripSummary() {
    const summaryContent = document.getElementById('summaryContent');
    const totalActs = currentTrip.days.reduce((acc, d) => acc + d.activities.length, 0);

    let html = `
        <div style="margin-bottom:15px;">
            <h4>${currentTrip.name} - ${currentTrip.destination}</h4>
            <p style="font-size:0.88rem; color:var(--text-muted);">
                <strong>Dates:</strong> ${currentTrip.startDate} to ${currentTrip.endDate} | 
                <strong>Duration:</strong> ${currentTrip.totalDays} Days | 
                <strong>Travelers:</strong> ${currentTrip.travelers} | 
                <strong>Total Scheduled Activities:</strong> ${totalActs}
            </p>
        </div>
    `;

    currentTrip.days.forEach(d => {
        html += `<div class="summary-day-group">
            <h5>Day ${d.dayNumber}</h5>`;
        if (d.activities.length === 0) {
            html += `<div class="summary-act-item" style="color:#888;">No activities scheduled</div>`;
        } else {
            d.activities.forEach(a => {
                html += `<div class="summary-act-item">
                    <strong>[${a.time}]</strong> ${a.name} @ ${a.location} (${a.category})
                </div>`;
            });
        }
        html += `</div>`;
    });

    summaryContent.innerHTML = html;
}

// --- 2. EXISTING UI & DASHBOARD INTEGRATION ---
function updateDirectoryAndDashboard() {
    const count = savedFavorites.length;
    document.getElementById('navFavCount').textContent = count;
    document.getElementById('quickFavCount').textContent = count;
    document.getElementById('profileFavCount').textContent = count;

    // Render Favorites
    const favItems = destinations.filter(d => savedFavorites.includes(d.id));
    const favoritesGrid = document.getElementById('favoritesGrid');
    favoritesGrid.innerHTML = favItems.length === 0 ? 
        `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No saved favorites yet.</p>` :
        favItems.map(item => createCardHTML(item)).join('');

    // Render Directory
    filterDirectory();
}

function createCardHTML(item) {
    const isFav = savedFavorites.includes(item.id);
    return `
        <div class="card">
            <div class="card-img-wrapper">
                <img src="${item.image}" alt="${item.name}">
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${item.id})"><i class="fa-solid fa-heart"></i></button>
            </div>
            <div class="card-body">
                <h3>${item.name}</h3>
                <p class="location"><i class="fa-solid fa-location-dot"></i> ${item.country}</p>
                <p>${item.description}</p>
            </div>
        </div>
    `;
}

window.toggleFavorite = function(id) {
    if (savedFavorites.includes(id)) {
        savedFavorites = savedFavorites.filter(fId => fId !== id);
        showToast("Removed from favorites");
    } else {
        savedFavorites.push(id);
        showToast("Saved to favorites!");
    }
    localStorage.setItem('wanderlust_favs', JSON.stringify(savedFavorites));
    updateDirectoryAndDashboard();
};

function filterDirectory() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const activeBtn = document.querySelector('.filter-btn.active');
    const category = activeBtn ? activeBtn.getAttribute('data-filter') : 'All';

    const filtered = destinations.filter(d => {
        const matchesCat = category === 'All' || d.category === category;
        const matchesSearch = d.name.toLowerCase().includes(searchInput) || d.country.toLowerCase().includes(searchInput);
        return matchesCat && matchesSearch;
    });

    document.getElementById('destinationsGrid').innerHTML = filtered.map(item => createCardHTML(item)).join('');
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterDirectory();
    });
});

document.getElementById('searchInput').addEventListener('input', filterDirectory);

// Profile Management
document.getElementById('editProfileBtn').addEventListener('click', () => {
    document.getElementById('inputName').value = userProfile.name;
    document.getElementById('inputBio').value = userProfile.bio;
    document.getElementById('inputTrips').value = userProfile.trips;
    document.getElementById('profileModal').style.display = 'flex';
});

document.getElementById('closeProfileModal').addEventListener('click', () => {
    document.getElementById('profileModal').style.display = 'none';
});

document.getElementById('editProfileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    userProfile.name = document.getElementById('inputName').value;
    userProfile.bio = document.getElementById('inputBio').value;
    userProfile.trips = document.getElementById('inputTrips').value;

    localStorage.setItem('wanderlust_profile', JSON.stringify(userProfile));
    document.getElementById('profileNameDisplay').textContent = userProfile.name;
    document.getElementById('profileBioDisplay').textContent = userProfile.bio;
    document.getElementById('profileTripsCount').textContent = userProfile.trips;
    document.getElementById('profileModal').style.display = 'none';
    showToast('Profile updated!');
});

// Mobile Navbar Toggle
document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

// Initial Setup
if (currentTrip) saveAndRenderTrip();
updateDirectoryAndDashboard();