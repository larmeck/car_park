import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './styles/BookingModal.css';

Modal.setAppElement('#root'); 

export default function BookingModal({ isOpen, onRequestClose, onBook, slot }) {
  const [leaveTime, setLeaveTime] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    onBook(slot.id, leaveTime);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Book Slot"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">
        <h2>Book Slot {slot ? slot.slot_number : ''}</h2>
        <button className="modal-close-button" onClick={onRequestClose}>&times;</button>
      </div>
      <form onSubmit={handleSubmit} className="modal-form">
        <label>
          Choose a leave time:
          <DatePicker
            selected={leaveTime}
            onChange={(date) => setLeaveTime(date)}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm:ss"
            timeFormat="HH:mm:ss"
            minDate={new Date()}
            className="datepicker-input"
          />
        </label>
        <button type="submit" className="modal-book-button">Book Now</button>
      </form>
    </Modal>
  );
}