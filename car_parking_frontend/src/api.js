const BASE_URL = 'http://localhost/car_parking/car_parking_backend';

export async function register(email, firstName, lastName, password) {
  const response = await fetch(`${BASE_URL}/Auth/register.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, first_name: firstName, last_name: lastName, password }),
  });
  return await response.json();
}

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/Auth/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
}

export async function fetchSlots(token) {
  const response = await fetch(`${BASE_URL}/Booking/view_slots.php`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return await response.json();
}

export async function bookSlot(token, slotId, leaveTime) {
  const response = await fetch(`${BASE_URL}/Booking/book_slot.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ slot_id: slotId, leave_time: leaveTime }),
  });
  return await response.json();
}