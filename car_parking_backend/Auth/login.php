<?php
require '../Utilities/cors.php'; 
require '../env_loader.php';
require '../db_connection.php';
require '../Utilities/common.php';

$data = json_decode(file_get_contents("php://input"), true);
if(!isset($data['email'], $data['password'])) {
    sendJSON(['error' => 'All fields required']);
}

$email = $data['email'];
$password = $data['password'];

$stmt = $pdo->prepare("SELECT id, password FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if($user && password_verify($password, $user['password'])) {
    // 1. Generate a new JWT
    $userId = $user['id'];
    $token = generateJWT($userId);

    // 2. Store the token in the database for tracking
    $stmt = $pdo->prepare("UPDATE users SET token = ? WHERE id = ?");
    $stmt->execute([$token, $userId]);
    
    // 3. Send the token to the frontend
    sendJSON(['success' => 'Login successful', 'token' => $token]);
} else {
    sendJSON(['error' => 'Invalid email or password']);
}