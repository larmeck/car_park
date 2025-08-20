<?php
require '../Utilities/cors.php'; 

require '../db_connection.php';
require '../Utilities/common.php';

// Validate JWT
$headers = getallheaders();
if(!isset($headers['Authorization'])) sendJSON(['error'=>'No token provided']);
$token = str_replace('Bearer ','',$headers['Authorization']);
$userId = validateJWT($token);
if(!$userId) sendJSON(['error'=>'Invalid token']);

$data = json_decode(file_get_contents("php://input"), true);
if(!isset($data['slot_id'],$data['leave_time'])) sendJSON(['error'=>'All fields required']);

// This is the crucial check to ensure a user only books one slot at a time.
// It checks for a booking by the current user where the leave time is in the future.
$stmt = $pdo->prepare("SELECT id FROM parking_slots WHERE booked_by = ? AND leave_time > NOW()");
$stmt->execute([$userId]);
if($stmt->rowCount() > 0) {
    sendJSON(['error' => 'You already have a booked slot']);
}

// Use a single, atomic query to book the slot and set availability
$stmt = $pdo->prepare("UPDATE parking_slots SET booked_by=?, leave_time=?, available=0 WHERE id=? AND available = 1");

if($stmt->execute([$userId, $data['leave_time'], $data['slot_id']])) {
    // Check if any rows were actually updated. If not, the slot was already taken.
    if ($stmt->rowCount() > 0) {
        sendJSON(['success'=>'Slot booked successfully']);
    } else {
        sendJSON(['error'=>'Failed to book slot, it may already be taken']);
    }
} else {
    sendJSON(['error'=>'An error occurred while trying to book the slot']);
}