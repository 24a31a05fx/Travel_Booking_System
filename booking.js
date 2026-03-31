// booking.js

function getBookings() { try { return JSON.parse(localStorage.getItem('tbs_bookings') || '[]'); } catch(e) { return []; } }
function saveBookings(b) { localStorage.setItem('tbs_bookings', JSON.stringify(b)); }

document.addEventListener('DOMContentLoaded', function() {
  const bookingSummary = document.getElementById('bookingSummary');
  const bookingForm = document.getElementById('bookingForm');

  if (bookingSummary) {
    const data = JSON.parse(sessionStorage.getItem('tbs_selected_flight') || 'null');
    if (!data) {
      bookingSummary.innerHTML = '<div class="alert-box">No travel option selected. <a href="search.html">Go back to search.</a></div>';
      if (bookingForm) bookingForm.style.display = 'none';
      return;
    }
    const typeIcon = { Flight:'✈', Train:'🚂', Bus:'🚌' };
    bookingSummary.innerHTML = `
      <div class="summary-card fade-up">
        <div class="summary-row">
          <div class="summary-icon-wrap">${typeIcon[data.type] || '✈'}</div>
          <div class="summary-info">
            <h3>${data.company}</h3>
            <p>${data.type} · ${data.from} → ${data.to}</p>
            <p>${formatDate(data.date)}</p>
          </div>
          <div class="summary-time">
            <span>${data.depart} → ${data.arrive}</span>
            <small>${data.duration}</small>
          </div>
          <div class="summary-price">₹${Number(data.price).toLocaleString('en-IN')}</div>
        </div>
      </div>
    `;
  }

  const user = window.auth && window.auth.getCurrentUser();
  const emailInput = document.getElementById('passengerEmail');
  const nameInput  = document.getElementById('passengerName');
  if (user) {
    if (emailInput) emailInput.value = user.email;
    if (nameInput)  nameInput.value  = user.name;
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const data = JSON.parse(sessionStorage.getItem('tbs_selected_flight') || 'null');
      if (!data) { alert('Session expired. Please search again.'); window.location.href = 'search.html'; return; }
      const passenger = document.getElementById('passengerName').value.trim();
      const age       = document.getElementById('passengerAge').value.trim();
      const seat      = document.getElementById('seatSelection').value;
      const contact   = document.getElementById('contactNumber').value.trim();
      const email     = document.getElementById('passengerEmail').value.trim();
      if (!passenger || !age || !contact || !email) { alert('Please fill in all required fields.'); return; }
      if (!/^\\d{10}$/.test(contact.replace(/[\\s\\-\\+]/g, ''))) { alert('Please enter a valid 10-digit contact number.'); return; }
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { alert('Please enter a valid email address.'); return; }
      if (parseInt(age) < 1 || parseInt(age) > 120) { alert('Please enter a valid age (1–120).'); return; }
      sessionStorage.setItem('tbs_pending_booking', JSON.stringify({ ...data, passenger, age, seat: seat || 'No Preference', contact, email }));
      window.location.href = 'payment.html';
    });
  }
});

function loadUserBookings() {
  const user = window.auth && window.auth.getCurrentUser();
  if (!user) return;
  const bookingsList = document.getElementById('bookingsList');
  const emptyState   = document.getElementById('emptyBookings');
  const countBadge   = document.getElementById('bookingsCountBadge');
  if (!bookingsList) return;
  const all = getBookings();
  const mine = all.filter(b => b.userId === user.id);
  if (mine.length === 0) {
    bookingsList.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (countBadge) countBadge.style.display = 'none';
    return;
  }
  if (emptyState) emptyState.classList.add('hidden');
  if (countBadge) { countBadge.style.display = ''; countBadge.textContent = mine.length + ' booking' + (mine.length > 1 ? 's' : ''); }
  const typeIcon = { Flight:'✈', Train:'🚂', Bus:'🚌' };
  bookingsList.innerHTML = mine.map((b, i) => `
    <div class="booking-card fade-up" style="animation-delay:${i * 0.07}s" id="booking-${b.bookingId}">
      <div class="booking-card-header">
        <div class="booking-type-icon">${typeIcon[b.type] || '✈'}</div>
        <div class="booking-header-info">
          <h3>${b.company}</h3>
          <div class="booking-route-text">${b.from} → ${b.to}</div>
          <div class="booking-date-text">${formatDate(b.date)}</div>
        </div>
        <div class="booking-badges">
          <span class="type-pill ${b.type.toLowerCase()}">${b.type}</span>
          <span class="status-confirmed">✓ Confirmed</span>
        </div>
      </div>
      <div class="booking-card-body">
        <div class="detail-item">
          <div class="d-label">Passenger</div>
          <div class="d-value">${b.passenger}</div>
        </div>
        <div class="detail-item">
          <div class="d-label">Travel Time</div>
          <div class="d-value">${b.depart} → ${b.arrive}</div>
        </div>
        <div class="detail-item">
          <div class="d-label">Seat</div>
          <div class="d-value">${b.seat}</div>
        </div>
        <div class="detail-item">
          <div class="d-label">Contact</div>
          <div class="d-value">${b.contact}</div>
        </div>
        <div class="detail-item">
          <div class="d-label">Payment</div>
          <div class="d-value">${b.paymentMethod || 'Paid'}</div>
        </div>
        <div class="detail-item">
          <div class="d-label">Duration</div>
          <div class="d-value">${b.duration}</div>
        </div>
      </div>
      <div class="booking-card-footer">
        <div class="booking-id-wrap">
          <span class="booking-id-label">Booking ID</span>
          <span class="booking-id-value">${b.bookingId}</span>
        </div>
        <div class="booking-footer-right">
          <span class="booking-final-price">₹${Number(b.price).toLocaleString('en-IN')}</span>
          <button class="btn btn-danger btn-sm" onclick="cancelBooking('${b.bookingId}')">Cancel Booking</button>
        </div>
      </div>
    </div>
  `).join('');
}

function cancelBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking? This cannot be undone.')) return;
  const all = getBookings();
  saveBookings(all.filter(b => b.bookingId !== bookingId));
  const card = document.getElementById('booking-' + bookingId);
  if (card) {
    card.style.transition = 'all 0.35s ease';
    card.style.opacity = '0';
    card.style.transform = 'translateX(40px)';
    setTimeout(() => loadUserBookings(), 380);
  } else { loadUserBookings(); }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try { return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', weekday:'short' }); }
  catch(e) { return dateStr; }
}

window.loadUserBookings = loadUserBookings;
window.cancelBooking    = cancelBooking;
window.getBookings      = getBookings;
window.saveBookings     = saveBookings;
window.formatDate       = formatDate;

