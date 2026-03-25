// search.js — demo data + results rendering + search form

const TRAVEL_DATA = {
  Flight: [
    { id:'f1', company:'IndiGo', icon:'✈', depart:'06:00', arrive:'08:15', duration:'2h 15m', price:3499, seats:12, class:'Economy' },
    { id:'f2', company:'Air India', icon:'✈', depart:'09:30', arrive:'11:50', duration:'2h 20m', price:4899, seats:5, class:'Economy' },
    { id:'f3', company:'SpiceJet', icon:'✈', depart:'13:00', arrive:'15:05', duration:'2h 05m', price:2999, seats:20, class:'Economy' },
    { id:'f4', company:'Vistara', icon:'✈', depart:'17:45', arrive:'19:55', duration:'2h 10m', price:5499, seats:8, class:'Business' },
    { id:'f5', company:'GoFirst', icon:'✈', depart:'21:00', arrive:'23:10', duration:'2h 10m', price:2599, seats:30, class:'Economy' },
  ],
  Train: [
    { id:'t1', company:'Rajdhani Express', icon:'🚂', depart:'07:00', arrive:'13:30', duration:'6h 30m', price:1200, seats:40, class:'3AC' },
    { id:'t2', company:'Shatabdi Express', icon:'🚂', depart:'06:00', arrive:'11:00', duration:'5h 00m', price:999, seats:55, class:'CC' },
    { id:'t3', company:'Duronto Express', icon:'🚂', depart:'23:00', arrive:'07:30', duration:'8h 30m', price:1500, seats:18, class:'2AC' },
    { id:'t4', company:'Vande Bharat', icon:'🚂', depart:'08:00', arrive:'13:00', duration:'5h 00m', price:1800, seats:25, class:'EC' },
    { id:'t5', company:'Garib Rath', icon:'🚂', depart:'20:00', arrive:'06:00', duration:'10h 00m', price:750, seats:60, class:'3AC' },
  ],
  Bus: [
    { id:'b1', company:'VRL Travels', icon:'🚌', depart:'22:00', arrive:'06:30', duration:'8h 30m', price:799, seats:30, class:'AC Sleeper' },
    { id:'b2', company:'RedBus Express', icon:'🚌', depart:'21:00', arrive:'05:30', duration:'8h 30m', price:649, seats:15, class:'Non-AC' },
    { id:'b3', company:'KSRTC', icon:'🚌', depart:'07:00', arrive:'15:00', duration:'8h 00m', price:550, seats:45, class:'AC Semi-Sleeper' },
    { id:'b4', company:'Orange Travels', icon:'🚌', depart:'20:30', arrive:'05:00', duration:'8h 30m', price:899, seats:8, class:'Volvo AC' },
    { id:'b5', company:'SRS Travels', icon:'🚌', depart:'19:00', arrive:'04:00', duration:'9h 00m', price:499, seats:22, class:'Non-AC' },
  ]
};

function displayResults(from, to, date, type) {
  const container = document.getElementById('resultsContainer');
  if (!container) return;
  const options = TRAVEL_DATA[type] || TRAVEL_DATA['Flight'];
  if (!options || !options.length) {
    container.innerHTML = '<div class="no-results"><span class="no-results-icon">🔍</span><p>No options found. Try a different search.</p></div>';
    return;
  }
  container.innerHTML = '';
  options.forEach((opt, i) => {
    const typeLC = type.toLowerCase();
    const seatsLow = opt.seats < 10;
    const card = document.createElement('div');
    card.className = 'result-card fade-in';
    card.style.animationDelay = (i * 0.07) + 's';
    card.innerHTML = `
      <div class="result-card-top">
        <div class="result-airline-logo ${typeLC}">${opt.icon}</div>
        <div class="result-company">
          <span class="result-company-name">${opt.company}</span>
          <span class="result-class">${opt.class}</span>
        </div>
        <div class="result-route">
          <div class="time-col">
            <span class="time-big">${opt.depart}</span>
            <span class="time-city">${from || 'DEP'}</span>
          </div>
          <div class="route-line">
            <div class="route-line-bar"></div>
            <span class="route-duration">${opt.duration}</span>
          </div>
          <div class="time-col">
            <span class="time-big">${opt.arrive}</span>
            <span class="time-city">${to || 'ARR'}</span>
          </div>
        </div>
        <div class="result-price-col">
          <span class="result-price">₹${Number(opt.price).toLocaleString('en-IN')}</span>
          <span class="result-price-label">per person</span>
        </div>
      </div>
      <div class="result-card-bottom">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="type-pill ${typeLC}">${type}</span>
          <span class="seats-badge ${seatsLow?'low':'ok'}">${seatsLow?'⚠':'✓'} ${opt.seats} seats left</span>
        </div>
        <button class="btn btn-primary" onclick="bookNow('${opt.id}','${type}','${from}','${to}','${date}','${opt.company}','${opt.depart}','${opt.arrive}','${opt.duration}',${opt.price})">
          Book Now →
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function bookNow(id, type, from, to, date, company, depart, arrive, duration, price) {
  const user = window.auth && window.auth.getCurrentUser();
  if (!user) { window.location.href = 'login.html'; return; }
  sessionStorage.setItem('tbs_selected_flight', JSON.stringify({ id, type, from, to, date, company, depart, arrive, duration, price }));
  // Store results URL for back navigation
  sessionStorage.setItem('tbs_results_url', window.location.href);
  window.location.href = 'booking.html';
}

// Search form logic
document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(inp => { if (!inp.value) inp.min = today; });

  const travelDateInput = document.getElementById('travelDate');
  if (travelDateInput) {
    if (!travelDateInput.value) travelDateInput.value = today;
    const departSub = document.getElementById('departSub');
    function updateDay() {
      if (travelDateInput.value && departSub) {
        departSub.textContent = new Date(travelDateInput.value + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long' });
      }
    }
    travelDateInput.addEventListener('change', updateDay);
    updateDay();
  }

  // Trip type buttons
  const tripBtns = document.querySelectorAll('.trip-btn');
  const returnField = document.querySelector('.return-field');
  const returnDate = document.getElementById('returnDate');
  tripBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      tripBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const isRound = this.dataset.trip !== 'oneway';
      if (returnField) returnField.classList.toggle('active-return', isRound);
      if (returnDate) returnDate.disabled = !isRound;
    });
  });

  // Nav type buttons
  const navItems = document.querySelectorAll('.nav-item');
  const travelTypeInput = document.getElementById('travelType');
  const typeMap = { '✈':'Flight', '🚂':'Train', '🚌':'Bus', '🏨':'Hotel', '🚗':'Cab' };
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      navItems.forEach(n => n.classList.remove('active'));
      this.classList.add('active');
      const icon = this.querySelector('.nav-icon');
      if (icon && travelTypeInput) travelTypeInput.value = typeMap[icon.textContent.trim()] || 'Flight';
    });
  });

  // Swap
  const swapBtn = document.getElementById('swapBtn');
  if (swapBtn) {
    swapBtn.addEventListener('click', function() {
      const from = document.getElementById('fromCity'), to = document.getElementById('toCity');
      const fromSub = document.getElementById('fromSub'), toSub = document.getElementById('toSub');
      if (from && to) {
        [from.value, to.value] = [to.value, from.value];
        if (fromSub && toSub) [fromSub.textContent, toSub.textContent] = [toSub.textContent, fromSub.textContent];
      }
    });
  }

  // Search form
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const from = (document.getElementById('fromCity').value || '').trim();
      const to   = (document.getElementById('toCity').value || '').trim();
      const date = (document.getElementById('travelDate').value || '').trim();
      const type = document.getElementById('travelType') ? document.getElementById('travelType').value : 'Flight';
      if (!from || !to || !date) { alert('Please fill in From, To, and Date.'); return; }
      if (from.toLowerCase() === to.toLowerCase()) { alert('From and To cities cannot be the same.'); return; }
      window.location.href = `results.html?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}&type=${encodeURIComponent(type)}`;
    });
  }

  // Offer tabs
  document.querySelectorAll('.offer-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.offer-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Carousel
  const track = document.querySelector('.carousel-track');
  if (track) {
    let pos = 0;
    document.querySelector('.carousel-btn.next')?.addEventListener('click', () => {
      pos = Math.min(pos + 260, track.scrollWidth - track.clientWidth);
      track.scrollTo({ left: pos, behavior: 'smooth' });
    });
    document.querySelector('.carousel-btn.prev')?.addEventListener('click', () => {
      pos = Math.max(pos - 260, 0);
      track.scrollTo({ left: pos, behavior: 'smooth' });
    });
  }

  // Dark mode
  const darkToggle = document.querySelector('.dark-toggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
  }
});

window.displayResults = displayResults;
window.bookNow = bookNow;
window.TRAVEL_DATA = TRAVEL_DATA;

