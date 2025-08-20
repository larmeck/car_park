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

// Use a LEFT JOIN to fetch user names for booked slots
$stmt = $pdo->query("
    SELECT 
        p.*, 
        u.first_name, 
        u.last_name 
    FROM 
        parking_slots p 
    LEFT JOIN 
        users u 
    ON 
        p.booked_by = u.id 
    ORDER BY 
        p.id ASC
");

$slots = $stmt->fetchAll(PDO::FETCH_ASSOC);

sendJSON(['slots' => $slots]);