// ==================== AUTOCOMPLETE.JS ====================
// City autocomplete for search form

const INDIAN_CITIES = [
    { name: 'Delhi', code: 'DEL', airport: 'Indira Gandhi International Airport' },
    { name: 'Mumbai', code: 'BOM', airport: 'Chhatrapati Shivaji International Airport' },
    { name: 'Bangalore', code: 'BLR', airport: 'Kempegowda International Airport' },
    { name: 'Chennai', code: 'MAA', airport: 'Chennai International Airport' },
    { name: 'Kolkata', code: 'CCU', airport: 'Netaji Subhash Chandra Bose International Airport' },
    { name: 'Hyderabad', code: 'HYD', airport: 'Rajiv Gandhi International Airport' },
    { name: 'Pune', code: 'PNQ', airport: 'Pune Airport' },
    { name: 'Ahmedabad', code: 'AMD', airport: 'Sardar Vallabhbhai Patel International Airport' },
    { name: 'Jaipur', code: 'JAI', airport: 'Jaipur International Airport' },
    { name: 'Goa', code: 'GOI', airport: 'Dabolim Airport' },
    { name: 'Kochi', code: 'COK', airport: 'Cochin International Airport' },
    { name: 'Lucknow', code: 'LKO', airport: 'Chaudhary Charan Singh International Airport' },
    { name: 'Chandigarh', code: 'IXC', airport: 'Chandigarh International Airport' },
    { name: 'Bhopal', code: 'BHO', airport: 'Raja Bhoj Airport' },
    { name: 'Patna', code: 'PAT', airport: 'Jay Prakash Narayan International Airport' },
    { name: 'Nagpur', code: 'NAG', airport: 'Dr. Babasaheb Ambedkar International Airport' },
    { name: 'Srinagar', code: 'SXR', airport: 'Sheikh ul-Alam International Airport' },
    { name: 'Amritsar', code: 'ATQ', airport: 'Sri Guru Ram Dass Jee International Airport' },
    { name: 'Varanasi', code: 'VNS', airport: 'Lal Bahadur Shastri International Airport' },
    { name: 'Indore', code: 'IDR', airport: 'Devi Ahilya Bai Holkar Airport' },
];

function setupAutocomplete(inputId, subId, suggestionsId) {
    const input = document.getElementById(inputId);
    const sub = document.getElementById(subId);
    const dropdown = document.getElementById(suggestionsId);
    if (!input || !dropdown) return;

    input.addEventListener('input', function() {
        const val = this.value.toLowerCase().trim();
        if (!val) { dropdown.classList.add('hidden'); return; }
        const matches = INDIAN_CITIES.filter(c =>
            c.name.toLowerCase().startsWith(val) || c.code.toLowerCase().startsWith(val)
        );
        if (!matches.length) { dropdown.classList.add('hidden'); return; }
        dropdown.innerHTML = matches.map(c => `
            <div class="suggestion-item" data-name="${c.name}" data-code="${c.code}" data-airport="${c.airport}">
                <span class="sug-city">${c.name}</span>
                <span class="sug-detail">[${c.code}] ${c.airport}</span>
            </div>
        `).join('');
        dropdown.classList.remove('hidden');
    });

    dropdown.addEventListener('click', function(e) {
        const item = e.target.closest('.suggestion-item');
        if (!item) return;
        input.value = item.dataset.name;
        if (sub) sub.textContent = '[' + item.dataset.code + '] ' + item.dataset.airport;
        dropdown.classList.add('hidden');
    });

    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });

    input.addEventListener('focus', function() {
        if (this.value) this.dispatchEvent(new Event('input'));
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupAutocomplete('fromCity', 'fromSub', 'fromSuggestions');
    setupAutocomplete('toCity', 'toSub', 'toSuggestions');
});

