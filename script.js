// --- 1. TRAVEL SERVICES DATA REPOSITORY ---
const travelServices = [
    {
        id: 101,
        name: "Serena Hotel Hunza",
        category: "Hotels",
        location: "Karimabad, Hunza Valley",
        rating: 4.9,
        price: 120,
        priceUnit: "per night",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        description: "Luxury heritage resort offering panoramic views of Ultar Sar peak, premium dining, and authentic Hunza hospitality.",
        facilities: ["Free Wi-Fi", "Free Breakfast", "Mountain View", "Heated Rooms", "24/7 Room Service"],
        terms: "Check-in: 2:00 PM. Cancellation allowed up to 48 hours before check-in date."
    },
    {
        id: 102,
        name: "Private SUV Overland Express",
        category: "Transportation",
        location: "Islamabad to Northern Areas",
        rating: 4.8,
        price: 90,
        priceUnit: "per day",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
        description: "Chauffeur-driven 4x4 Prado/Fortuner equipped for mountain terrains with experienced highway drivers.",
        facilities: ["AC / Heater", "Dedicated Driver", "Fuel Included", "Luggage Carrier", "Flexible Stops"],
        terms: "Includes driver allowance. Toll taxes extra where applicable."
    },
    {
        id: 103,
        name: "5-Day Skardu & Deosai Explorer",
        category: "Tour Packages",
        location: "Skardu, Gilgit-Baltistan",
        rating: 5.0,
        price: 350,
        priceUnit: "per person",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        description: "All-inclusive guided expedition covering Shangrila Resort, Katpana Cold Desert, and Deosai National Park.",
        facilities: ["Hotel Accommodation", "3 Meals Daily", "4x4 Jeeps", "Tour Guide", "Entry Permits"],
        terms: "Minimum 2 travelers required. Valid CNIC / Passport necessary for checkpoints."
    },
    {
        id: 104,
        name: "K2 Base Camp Jet-Boat Tour",
        category: "Activities",
        location: "Attabad Lake, Hunza",
        rating: 4.7,
        price: 45,
        priceUnit: "per ride",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        description: "High-speed turquoise water jet boating experience surrounded by Karakoram mountain peaks.",
        facilities: ["Life Jackets Provided", "Professional Pilot", "Safety Briefing", "HD Photos Option"],
        terms: "Subject to weather conditions. Children under 5 must be accompanied by adults."
    },
    {
        id: 105,
        name: "The Eagle's Nest Restaurant",
        category: "Restaurants",
        location: "Duikar, Hunza",
        rating: 4.9,
        price: 25,
        priceUnit: "per person",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        description: "Highest rooftop restaurant in Hunza serving traditional Chapshuro, local apricot juice, and continental dishes.",
        facilities: ["Sunset View Point", "Outdoor Seating", "Traditional Cuisine", "Warm Fireplace"],
        terms: "Prior table reservation recommended for sunset timings."
    }
];

// --- Persistent State Variables ---
let bookingHistory = JSON.parse(localStorage.getItem('wanderlust_bookings')) || [];
let currentTrip = JSON.parse(localStorage.getItem('wanderlust_trip')) || null;
let savedFavorites = JSON.parse(localStorage.getItem('wanderlust_favs')) || [101];

// --- Toast Notification Helper ---
function showToast(msg) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- 2. RENDER TRAVEL SERVICES DIRECTORY ---
const servicesGrid = document.getElementById('servicesGrid');

function renderServices() {
    const searchVal = document.getElementById('serviceSearchInput').value.toLowerCase();
    const activeBtn = document.querySelector('.svc-filter-btn.active');
    const selectedCategory = activeBtn ? activeBtn.getAttribute('data-svc-filter') : 'All';

    const filtered = travelServices.filter(svc => {
        const matchesCategory = selectedCategory === 'All' || svc.category === selectedCategory;
        const matchesSearch = svc.name.toLowerCase().includes(searchVal) || 
                              svc.location.toLowerCase().includes(searchVal) ||
                              svc.category.toLowerCase().includes(searchVal);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        servicesGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">No travel services match your criteria.</p>`;
        return;
    }

    servicesGrid.innerHTML = filtered.map(svc => `
        <div class="svc-card">
            <div class="svc-img-wrapper">
                <img src="${svc.image}" alt="${svc.name}">
                <span class="svc-category-badge">${svc.category}</span>
            </div>
            <div class="svc-card-body">
                <h3>${svc.name}</h3>
                <p class="svc-location"><i class="fa-solid fa-location-dot"></i> ${svc.location}</p>
                <div class="svc-meta-row">
                    <span class="svc-rating"><i class="fa-solid fa-star"></i> ${svc.rating}</span>
                    <span class="svc-price">$${svc.price} <small>/ ${svc.priceUnit}</small></span>
                </div>
                <div class="svc-card-actions">
                    <button class="btn btn-outline btn-sm" onclick="openServiceDetails(${svc.id})">Details</button>
                    <button class="btn btn-primary btn-sm" onclick="openBookingForm(${svc.id})">Book Now</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Service Filter & Search Listeners
document.querySelectorAll('.svc-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.svc-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderServices();
    });
});

document.getElementById('serviceSearchInput').addEventListener('input', renderServices);

// --- 3. SERVICE DETAILS MODAL HANDLERS ---
const svcDetailModal = document.getElementById('serviceDetailModal');

window.openServiceDetails = function(id) {
    const svc = travelServices.find(s => s.id === id);
    if (!svc) return;

    document.getElementById('svcDetailBody').innerHTML = `
        <div class="svc-detail-header">
            <img src="${svc.image}" alt="${svc.name}">
            <h2>${svc.name}</h2>
            <p class="svc-location" style="font-size:1rem;"><i class="fa-solid fa-location-dot"></i> ${svc.location} | <strong>${svc.category}</strong></p>
        </div>
        <p style="margin-top:10px;">${svc.description}</p>
        
        <h4 style="margin-top:15px; color:var(--dark-color);">Available Facilities & Highlights</h4>
        <div class="svc-facilities-list">
            ${svc.facilities.map(f => `<span class="facility-tag"><i class="fa-solid fa-check"></i> ${f}</span>`).join('')}
        </div>

        <div style="background:#f8fafc; padding:12px; border-radius:8px; margin:15px 0;">
            <p style="font-size:0.85rem; color:var(--text-muted);"><strong>Terms & Policy:</strong> ${svc.terms}</p>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
            <span style="font-size:1.4rem; font-weight:700; color:var(--primary-color);">$${svc.price} <small style="font-size:0.8rem; color:#666;">/ ${svc.priceUnit}</small></span>
            <button class="btn btn-primary" onclick="svcDetailModal.style.display='none'; openBookingForm(${svc.id});">
                <i class="fa-solid fa-calendar-check"></i> Proceed to Booking
            </button>
        </div>
    `;

    svcDetailModal.style.display = 'flex';
};

document.getElementById('closeSvcDetailModal').addEventListener('click', () => { svcDetailModal.style.display = 'none'; });

// --- 4. BOOKING FORM & DYNAMIC PRICE CALCULATION ---
const bookingFormModal = document.getElementById('bookingFormModal');
const serviceBookingForm = document.getElementById('serviceBookingForm');
const bookPeopleInput = document.getElementById('bookPeople');
const bookCalculatedPrice = document.getElementById('bookCalculatedPrice');

window.openBookingForm = function(id) {
    const svc = travelServices.find(s => s.id === id);
    if (!svc) return;

    document.getElementById('bookSvcId').value = svc.id;
    document.getElementById('bookSvcUnitPrice').value = svc.price;

    document.getElementById('formSvcBanner').innerHTML = `
        <strong>Selected Service:</strong> ${svc.name} ($${svc.price} / ${svc.priceUnit})
    `;

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('bookDate').value = tomorrow.toISOString().split('T')[0];

    updateBookingPrice();
    bookingFormModal.style.display = 'flex';
};

function updateBookingPrice() {
    const unitPrice = parseFloat(document.getElementById('bookSvcUnitPrice').value) || 0;
    const people = parseInt(bookPeopleInput.value) || 1;
    const total = unitPrice * people;
    bookCalculatedPrice.textContent = `$${total}`;
}

bookPeopleInput.addEventListener('input', updateBookingPrice);
document.getElementById('closeBookingFormModal').addEventListener('click', () => { bookingFormModal.style.display = 'none'; });

// Booking Form Submit Handler
serviceBookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const svcId = parseInt(document.getElementById('bookSvcId').value);
    const svc = travelServices.find(s => s.id === svcId);
    const fullName = document.getElementById('bookFullName').value.trim();
    const email = document.getElementById('bookEmail').value.trim();
    const phone = document.getElementById('bookPhone').value.trim();
    const date = document.getElementById('bookDate').value;
    const people = parseInt(bookPeopleInput.value);
    const specialReq = document.getElementById('bookSpecialReq').value.trim();
    const totalAmount = svc.price * people;

    // Form Validation Check
    if (!fullName || !email || !phone || !date) {
        showToast("Please complete all required fields.");
        return;
    }

    // Generate Booking ID (e.g., TRV-84920)
    const bookingId = "TRV-" + Math.floor(10000 + Math.random() * 90000);

    const newBooking = {
        bookingId,
        serviceName: svc.name,
        category: svc.category,
        customerName: fullName,
        email,
        phone,
        date,
        people,
        specialReq,
        totalAmount,
        status: "Confirmed"
    };

    bookingHistory.unshift(newBooking);
    localStorage.setItem('wanderlust_bookings', JSON.stringify(bookingHistory));

    bookingFormModal.style.display = 'none';
    showBookingReceipt(newBooking);
    renderBookingHistory();
});

// --- 5. RECEIPT & CONFIRMATION MODAL ---
const bookingReceiptModal = document.getElementById('bookingReceiptModal');

function showBookingReceipt(b) {
    document.getElementById('receiptContent').innerHTML = `
        <div class="receipt-row"><span>Booking ID:</span> <strong>${b.bookingId}</strong></div>
        <div class="receipt-row"><span>Customer:</span> <strong>${b.customerName}</strong></div>
        <div class="receipt-row"><span>Service:</span> <strong>${b.serviceName}</strong></div>
        <div class="receipt-row"><span>Date:</span> <strong>${b.date}</strong></div>
        <div class="receipt-row"><span>Travelers/Units:</span> <strong>${b.people} Person(s)</strong></div>
        <div class="receipt-row"><span>Total Amount:</span> <strong style="color:var(--primary-color); font-size:1.1rem;">$${b.totalAmount}</strong></div>
        <div class="receipt-row"><span>Status:</span> <strong style="color:var(--success-color);">${b.status}</strong></div>
    `;

    bookingReceiptModal.style.display = 'flex';
}

document.getElementById('closeReceiptModal').addEventListener('click', () => { bookingReceiptModal.style.display = 'none'; });
document.getElementById('finishBookingBtn').addEventListener('click', () => {
    bookingReceiptModal.style.display = 'none';
    location.href = '#dashboard';
});

// --- 6. DASHBOARD RESERVATIONS HISTORY ---
function renderBookingHistory() {
    const container = document.getElementById('bookingHistoryContainer');
    if (bookingHistory.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem; text-align:center; padding:20px;">No active service bookings found.</p>`;
        return;
    }

    container.innerHTML = bookingHistory.map(b => `
        <div class="booking-history-item">
            <div>
                <strong>${b.serviceName}</strong> <small>(${b.bookingId})</small>
                <div style="font-size:0.8rem; color:var(--text-muted);">${b.date} • ${b.people} Person(s) • ${b.customerName}</div>
            </div>
            <div style="text-align:right;">
                <span style="font-weight:700; color:var(--primary-color);">$${b.totalAmount}</span>
                <br><span class="badge badge-success" style="font-size:0.65rem;">${b.status}</span>
            </div>
        </div>
    `).join('');
}

// --- 7. TRIP PLANNER MODULE INTEGRATION ---
const tripForm = document.getElementById('tripForm');
const tripOverviewContainer = document.getElementById('tripOverviewContainer');
const itinerarySection = document.getElementById('itinerarySection');
const daysContainer = document.getElementById('daysContainer');

if (tripForm) {
    tripForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('tripName').value.trim();
        const destination = document.getElementById('tripDestination').value.trim();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const travelers = parseInt(document.getElementById('travelersCount').value);
        const description = document.getElementById('tripDescription').value.trim();

        const start = new Date(startDate);
        const end = new Date(endDate);
        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (totalDays <= 0) {
            showToast("Error: End date must be after Start date.");
            return;
        }

        let daysArray = [];
        for (let i = 1; i <= totalDays; i++) {
            daysArray.push({ dayNumber: i, activities: [] });
        }

        currentTrip = { name, destination, startDate, endDate, travelers, description, totalDays, days: daysArray };
        localStorage.setItem('wanderlust_trip', JSON.stringify(currentTrip));
        renderTrip();
        showToast("Trip plan updated!");
    });
}

function renderTrip() {
    if (!currentTrip || !tripOverviewContainer) return;

    document.getElementById('overviewTitle').textContent = currentTrip.name;
    document.getElementById('overviewDestination').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${currentTrip.destination}`;
    document.getElementById('overviewDates').textContent = `${currentTrip.startDate} to ${currentTrip.endDate}`;
    document.getElementById('overviewDays').textContent = `${currentTrip.totalDays} Day(s)`;
    document.getElementById('overviewTravelers').textContent = `${currentTrip.travelers} Traveler(s)`;

    tripOverviewContainer.style.display = 'block';
    itinerarySection.style.display = 'block';
}

document.getElementById('resetTripBtn')?.addEventListener('click', () => {
    currentTrip = null;
    localStorage.removeItem('wanderlust_trip');
    tripOverviewContainer.style.display = 'none';
    itinerarySection.style.display = 'none';
    showToast("Trip plan reset.");
});

// Navigation Toggle
document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

// Initial Executions
renderServices();
renderBookingHistory();
renderTrip();