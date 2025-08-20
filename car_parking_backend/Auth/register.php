<?php


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../Utilities/cors.php'; 

require '../db_connection.php';
require '../Utilities/common.php';

$data = json_decode(file_get_contents("php://input"), true);

// Update input check to include first_name and last_name
if(!isset($data['email'], $data['password'], $data['first_name'], $data['last_name'])) {
    sendJSON(['error' => 'All fields required']);
}

$email = $data['email'];
$first_name = $data['first_name'];
$last_name = $data['last_name'];
$password = $data['password'];

// Check if email already exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->rowCount() > 0) {
    sendJSON(['error' => 'Email already registered']);
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Update the INSERT query to include first_name and last_name
$stmt = $pdo->prepare("INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)");

if ($stmt->execute([$email, $first_name, $last_name, $hashedPassword])) {
    sendJSON(['success' => 'Registration successful']);
} else {
    sendJSON(['error' => 'Registration failed']);
}