import { useEffect, useState, useCallback } from "react";
import { fetchSlots, bookSlot } from "../api";
import '../styles/ParkingLot.css';
import BookingModal from "../BookingModal";

export default function ParkingLot({ token }) {
  const [slots, setSlots] = useState([]);
  const [banner, setBanner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const slotsPerPage = 20;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const loadSlots = useCallback(async () => {
    const res = await fetchSlots(token);
    if (res.error) {
      setBanner(res.error);
      setSlots([]);
    } else if (res.slots) {
      setSlots(res.slots);
    } else {
      setBanner("No slots data received.");
      setSlots([]);
    }
  }, [token]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const openBookingModal = (slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };
  
  const handleBooking = async (slotId, leaveTime) => {
    const formattedLeaveTime = leaveTime.toISOString().slice(0, 19).replace('T', ' ');
    
    const res = await bookSlot(token, slotId, formattedLeaveTime);
    setBanner(res.error || res.success);

    if (res.success) {
      await loadSlots(); 
    }
  };

  const indexOfLastSlot = currentPage * slotsPerPage;
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
  const currentSlots = slots.slice(indexOfFirstSlot, indexOfLastSlot);
  
  const totalPages = Math.ceil(slots.length / slotsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`pagination-item ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </li>
      );
    }
    return pageNumbers;
  };
  
  return (
    <div className="parking-lot-container">
      {banner && <div className="banner error">{banner}</div>}
      <h2>Parking Slots</h2>
      <ul className="slot-list">
        {currentSlots.length > 0 ? (
          currentSlots.map(slot => (
            <li 
              key={slot.id} 
              className={`slot-list-item ${!slot.available ? 'booked-slot' : ''}`}
            >
              <span>
                Slot {slot.id} - 
                {slot.available ? 
                  <span className="slot-status-available">Available</span> :
                  <span className="slot-status-booked">
                    {/* Updated logic to show both name and release time */}
                    {slot.first_name && slot.last_name ? 
                        `Booked by: ${slot.first_name} ${slot.last_name}` : 
                        `Booked`
                    }
                    {slot.leave_time && ` until ${new Date(slot.leave_time).toLocaleString()}`}
                  </span>
                }
              </span>
              {slot.available && <button onClick={() => openBookingModal(slot)}>Book</button>}
            </li>
          ))
        ) : (
          <div>{banner ? '' : 'Loading slots...'}</div>
        )}
      </ul>
      
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <ul className="pagination-list">
            {renderPageNumbers()}
          </ul>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}

      {selectedSlot && (
        <BookingModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onBook={handleBooking}
          slot={selectedSlot}
        />
      )}
    </div>
  );
}