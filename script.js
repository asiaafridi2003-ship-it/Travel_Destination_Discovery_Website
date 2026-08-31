// --- 1. SEED COMMUNITY REVIEWS REPOSITORY ---
const initialReviews = [
    {
        id: 1,
        author: "Amina Khan",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        target: "Serena Hotel Hunza",
        rating: 5,
        date: "2026-08-15",
        text: "The view of Ultar Sar peak from our room balcony was unforgettable! Exceptional hospitality and authentic local breakfast options.",
        photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
        helpfulCount: 24
    },
    {
        id: 2,
        author: "Hamza Tariq",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        target: "Private SUV Overland Express",
        rating: 4,
        date: "2026-08-20",
        text: "Punctual driver with deep knowledge of Karakoram Highway routes. Vehicle was clean and handled rough mountain roads safely.",
        photo: null,
        helpfulCount: 11
    },
    {
        id: 3,
        author: "Sara Malik",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        target: "Attabad Lake Jet-Boat Tour",
        rating: 5,
        date: "2026-08-28",
        text: "Thrilling boat ride across the turquoise waters! Life jackets were properly fitted, and the pilot gave us plenty of time for photos.",
        photo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
        helpfulCount: 18
    }
];

// LocalStorage State Management
let reviews = JSON.parse(localStorage.getItem('wanderlust_reviews')) || initialReviews;
let helpfulVotes = JSON.parse(localStorage.getItem('wanderlust_votes')) || {};

// Rating Text Mapping
const ratingLabels = {
    1: "1 - Poor",
    2: "2 - Needs Improvement",
    3: "3 - Average",
    4: "4 - Good",
    5: "5 - Excellent"
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

// Helper: Render Star Icons
function getStarIcons(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHtml += `<i class="fa-solid fa-star"></i>`;
        } else {
            starsHtml += `<i class="fa-regular fa-star"></i>`;
        }
    }
    return starsHtml;
}

// --- 2. AGGREGATE RATING CALCULATIONS & PROGRESS BARS ---
function updateRatingDashboard() {
    const total = reviews.length;
    const avgScoreDisplay = document.getElementById('avgScoreDisplay');
    const avgStarsDisplay = document.getElementById('avgStarsDisplay');
    const totalReviewsDisplay = document.getElementById('totalReviewsDisplay');
    const barsContainer = document.getElementById('ratingBarsContainer');

    if (total === 0) {
        avgScoreDisplay.textContent = "0.0";
        avgStarsDisplay.innerHTML = getStarIcons(0);
        totalReviewsDisplay.textContent = "0";
        barsContainer.innerHTML = "<p>No ratings submitted yet.</p>";
        return;
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = (sum / total).toFixed(1);

    avgScoreDisplay.textContent = avg;
    avgStarsDisplay.innerHTML = getStarIcons(Math.round(avg));
    totalReviewsDisplay.textContent = total;

    // Calculate distribution counts (5 to 1 star)
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => counts[r.rating] = (counts[r.rating] || 0) + 1);

    barsContainer.innerHTML = [5, 4, 3, 2, 1].map(star => {
        const count = counts[star] || 0;
        const pct = Math.round((count / total) * 100);
        return `
            <div class="rating-bar-row">
                <label>${star} Stars</label>
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${pct}%;"></div>
                </div>
                <span class="bar-count">${count}</span>
            </div>
        `;
    }).join('');
}

// --- 3. RENDER REVIEWS FEED & HELPFUL UPVOTE SYSTEM ---
const reviewsGrid = document.getElementById('reviewsGrid');

function renderReviews() {
    const activeBtn = document.querySelector('.rev-filter-btn.active');
    const selectedFilter = activeBtn ? activeBtn.getAttribute('data-rating') : 'All';

    const filtered = reviews.filter(r => {
        if (selectedFilter === 'All') return true;
        return r.rating === parseInt(selectedFilter);
    });

    if (filtered.length === 0) {
        reviewsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">No reviews match the selected filter rating.</p>`;
        return;
    }

    reviewsGrid.innerHTML = filtered.map(r => {
        const hasVoted = helpfulVotes[r.id];
        return `
            <div class="review-card">
                <div class="review-header">
                    <img src="${r.avatar}" alt="${r.author}" class="avatar-img">
                    <div class="review-author-info">
                        <h4>${r.author}</h4>
                        <small><i class="fa-regular fa-clock"></i> ${r.date}</small><br>
                        <span class="review-target-tag">${r.target}</span>
                    </div>
                </div>
                <div class="review-stars">${getStarIcons(r.rating)}</div>
                <p class="review-body">${r.text}</p>
                ${r.photo ? `<img src="${r.photo}" alt="Review photo" class="review-user-photo">` : ''}
                <div class="review-footer">
                    <button class="helpful-btn ${hasVoted ? 'active' : ''}" onclick="toggleHelpful(${r.id})">
                        <i class="fa-solid fa-thumbs-up"></i> Helpful — ${r.helpfulCount}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Toggle Helpful Counter
window.toggleHelpful = function(id) {
    const rev = reviews.find(r => r.id === id);
    if (!rev) return;

    if (helpfulVotes[id]) {
        rev.helpfulCount -= 1;
        delete helpfulVotes[id];
        showToast("Helpful vote removed.");
    } else {
        rev.helpfulCount += 1;
        helpfulVotes[id] = true;
        showToast("Marked review as helpful!");
    }

    localStorage.setItem('wanderlust_reviews', JSON.stringify(reviews));
    localStorage.setItem('wanderlust_votes', JSON.stringify(helpfulVotes));
    renderReviews();
};

// Filter Button Listeners
document.querySelectorAll('.rev-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.rev-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderReviews();
    });
});

// --- 4. INTERACTIVE STAR RATING PICKER & SUBMISSION FORM ---
const starBtns = document.querySelectorAll('#starPicker .star-btn');
const ratingValueInput = document.getElementById('revRatingValue');
const ratingTextLabel = document.getElementById('ratingText');

starBtns.forEach(star => {
    star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('data-value'));
        ratingValueInput.value = val;
        ratingTextLabel.textContent = ratingLabels[val];

        starBtns.forEach(s => {
            const sVal = parseInt(s.getAttribute('data-value'));
            if (sVal <= val) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });
});

// Submit New Review
const addReviewForm = document.getElementById('addReviewForm');
addReviewForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const author = document.getElementById('revAuthor').value.trim();
    const target = document.getElementById('revTarget').value.trim();
    const rating = parseInt(ratingValueInput.value);
    const text = document.getElementById('revText').value.trim();
    const photo = document.getElementById('revImage').value.trim();

    // Form Validation Check
    if (rating === 0) {
        showToast("Please select a star rating between 1 and 5.");
        return;
    }
    if (!author || !target || !text) {
        showToast("Please complete all required fields.");
        return;
    }

    const newReview = {
        id: Date.now(),
        author,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        target,
        rating,
        date: new Date().toISOString().split('T')[0],
        text,
        photo: photo !== "" ? photo : null,
        helpfulCount: 0
    };

    reviews.unshift(newReview);
    localStorage.setItem('wanderlust_reviews', JSON.stringify(reviews));

    // Reset Form State
    addReviewForm.reset();
    ratingValueInput.value = "0";
    ratingTextLabel.textContent = "Select Rating";
    starBtns.forEach(s => s.classList.remove('active'));

    updateRatingDashboard();
    renderReviews();
    showToast("Thank you! Your review has been published.");
    location.href = '#community';
});

// Navigation Toggle
document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

// Initial Executions
updateRatingDashboard();
renderReviews();