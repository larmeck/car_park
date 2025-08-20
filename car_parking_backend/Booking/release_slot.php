<?php
require '../Utilities/cors.php'; 

require '../db_connection.php';
require '../Utilities/common.php';

$pdo->query("UPDATE parking_slots p 
             JOIN bookings b ON p.id=b.slot_id 
             SET p.available=1 
             WHERE b.leave_time <= NOW()");
echo "Slots updated";
?>
