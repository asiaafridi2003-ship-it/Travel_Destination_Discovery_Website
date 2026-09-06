// --- 1. DESTINATIONS REPOSITORY WITH MATCHING METADATA ---
const destinationKnowledgeBase = [
    {
        id: 201,
        name: "Hunza Valley",
        location: "Gilgit-Baltistan",
        rating: 4.9,
        estimatedCost: "$120 / day",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        budgetTier: "Medium",
        type: ["Adventure", "Relaxation", "Cultural"],
        environment: "Mountains",
        duration: "Medium",
        highlights: "Altit & Baltit Forts, Passu Cones, Attabad Lake."
    },
    {
        id: 202,
        name: "Skardu & Deosai Plains",
        location: "Gilgit-Baltistan",
        rating: 5.0,
        estimatedCost: "$140 / day",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        budgetTier: "Medium",
        type: ["Adventure", "Family"],
        environment: "Mountains",
        duration: "Long",
        highlights: "Shangrila Lake, Katpana Cold Desert, Deosai National Park."
    },
    {
        id: 203,
        name: "Swat Valley & Kalam",
        location: "Khyber Pakhtunkhwa",
        rating: 4.7,
        estimatedCost: "$70 / day",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        budgetTier: "Budget",
        type: ["Family", "Relaxation"],
        environment: "Mountains",
        duration: "Weekend",
        highlights: "Mahodand Lake, Malam Jabba Ski Resort, Ushu Forest."
    },
    {
        id: 204,
        name: "Historical Lahore Heritage Circuit",
        location: "Punjab",
        rating: 4.8,
        estimatedCost: "$50 / day",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        budgetTier: "Budget",
        type: ["Cultural", "Family"],
        environment: "Historical",
        duration: "Weekend",
        highlights: "Badshahi Mosque, Lahore Fort, Food Street."
    }
];

// Toast Notification Helper
function showToast(msg) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- 2. RULE-BASED RECOMMENDATION ENGINE ---
const recommendationForm = document.getElementById('recommendationForm');
const recommendationsGrid = document.getElementById('recommendationsGrid');

function computeRecommendations() {
    const budget = document.getElementById('prefBudget').value;
    const type = document.getElementById('prefType').value;
    const duration = document.getElementById('prefDuration').value;
    const environment = document.getElementById('prefEnvironment').value;

    // Score destinations using preference matching logic
    const scoredDestinations = destinationKnowledgeBase.map(dest => {
        let score = 0;
        let reasons = [];

        if (dest.budgetTier === budget) {
            score += 30;
            reasons.push(`Fits your ${budget} budget preference`);
        }
        if (dest.type.includes(type)) {
            score += 30;
            reasons.push(`Ideal for ${type} travel style`);
        }
        if (dest.environment === environment) {
            score += 25;
            reasons.push(`Matches ${environment} environment`);
        }
        if (dest.duration === duration) {
            score += 15;
            reasons.push(`Suited for a ${duration} timeframe`);
        }

        return { ...dest, score, matchReason: reasons.join(" • ") };
    });

    // Sort by match score descending
    scoredDestinations.sort((a, b) => b.score - a.score);

    // Render Recommendation Cards
    recommendationsGrid.innerHTML = scoredDestinations.map(dest => `
        <div class="rec-card">
            <div class="rec-img-box">
                <img src="${dest.image}" alt="${dest.name}">
                <span class="rec-badge">${dest.score}% Match</span>
            </div>
            <div class="rec-body">
                <h4>${dest.name}</h4>
                <p class="rec-location"><i class="fa-solid fa-location-dot"></i> ${dest.location}</p>

                <div class="rec-reason-box">
                    <i class="fa-solid fa-sparkles"></i> <strong>Why Recommended:</strong> ${dest.matchReason || "Popular destination."}
                </div>

                <div class="rec-meta">
                    <span><i class="fa-solid fa-star" style="color:var(--accent-color);"></i> ${dest.rating}</span>
                    <strong style="color:var(--primary-color);">${dest.estimatedCost}</strong>
                </div>
            </div>
        </div>
    `).join('');
}

recommendationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    computeRecommendations();
    showToast("Smart recommendations updated based on your preferences!");
});

// --- 3. TRAVEL ASSISTANT INTERACTIVE RESPONSES ---
const assistantKnowledge = {
    budget: `
        <h5><i class="fa-solid fa-wallet"></i> Top Low-Budget Recommendations</h5>
        <p>If you are traveling on an economy budget, consider <strong>Swat Valley</strong> or <strong>Historical Lahore</strong>.</p>
        <ul>
            <li><strong>Swat Valley:</strong> Affordable public transit, budget guesthouses, and scenic mountain views ($40-$60/day).</li>
            <li><strong>Lahore:</strong> Low-cost heritage tours, budget street food, and affordable local transport.</li>
        </ul>
    `,
    family: `
        <h5><i class="fa-solid fa-people-roof"></i> Family-Friendly Travel Destinations</h5>
        <p>For family vacations with kids or elders, choose locations with good road access and accessible amenities:</p>
        <ul>
            <li><strong>Shangrila Skardu:</strong> Peaceful lakeside resorts with paved access.</li>
            <li><strong>Hunza Valley:</strong> Historic forts, gentle village walks, and safe local hospitality.</li>
        </ul>
    `,
    adventure: `
        <h5><i class="fa-solid fa-person-hiking"></i> Top Adventure & Trekking Spots</h5>
        <p>Looking for adrenaline and outdoor expeditions? We recommend:</p>
        <ul>
            <li><strong>K2 Base Camp Trek:</strong> World-class high-altitude trekking journey.</li>
            <li><strong>Attabad Lake Jet-Boating:</strong> High-speed water sports surrounded by Karakoram cliffs.</li>
            <li><strong>Deosai National Park:</strong> High-altitude plateau camping and wildlife spotting.</li>
        </ul>
    `,
    packing: `
        <h5><i class="fa-solid fa-suitcase"></i> Essential Mountain Travel Packing Checklist</h5>
        <p>When traveling to high-altitude regions (Hunza, Skardu, Swat):</p>
        <ul>
            <li>Thermal layers, windproof jacket, and sturdy trekking shoes.</li>
            <li>Sunscreen (SPF 50+), sunglasses, and lip balm for high UV protection.</li>
            <li>Power banks, cash in local currency (ATMs may have limited connectivity).</li>
        </ul>
    `,
    besttime: `
        <h5><i class="fa-solid fa-calendar-day"></i> Best Seasons to Visit Northern Areas</h5>
        <p>Timing your trip depends on the season and weather experience you prefer:</p>
        <ul>
            <li><strong>Cherry Blossom Season:</strong> April to May (vibrant pink blooms across Hunza).</li>
            <li><strong>Summer Trekking:</strong> June to August (clear passes to Deosai and lakes).</li>
            <li><strong>Autumn Foliage:</strong> October to November (golden orange trees across the valleys).</li>
        </ul>
    `
};

const assistantBtns = document.querySelectorAll('.assistant-btn');
const assistantResponseBody = document.getElementById('assistantResponseBody');

assistantBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        assistantBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const queryKey = btn.getAttribute('data-query');
        if (assistantKnowledge[queryKey]) {
            assistantResponseBody.innerHTML = assistantKnowledge[queryKey];
        }
    });
});

// --- 4. NAVIGATION HANDLERS & INITIALIZATION ---
document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('active');
});

// Initial Executions
computeRecommendations();