<?php
function sendJSON($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

// Generate JWT
function generateJWT($userId) {
    $header = json_encode(['typ'=>'JWT','alg'=>'HS256']);
    $payload = json_encode(['user_id'=>$userId, 'exp'=>time()+600]); 
    
    // Get the secret key from your .env file using $_ENV
    if (!isset($_ENV['JWT_SECRET'])) {
        sendJSON(['error' => 'JWT secret key not set']);
    }
    $secret_key = $_ENV['JWT_SECRET'];
    
    $base64UrlHeader = str_replace(['+','/','='], ['-','_',''], base64_encode($header));
    $base64UrlPayload = str_replace(['+','/','='], ['-','_',''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64UrlHeader.'.'.$base64UrlPayload, $secret_key, true);
    $base64UrlSignature = str_replace(['+','/','='], ['-','_',''], base64_encode($signature));
    
    return $base64UrlHeader.'.'.$base64UrlPayload.'.'.$base64UrlSignature;
}

// Validate JWT
function validateJWT($token) {
    $parts = explode('.', $token);
    if(count($parts) !== 3) return false;
    $header=$parts[0]; $payload=$parts[1]; $signature=$parts[2];
    
    // Get the secret key from your .env file using $_ENV
    if (!isset($_ENV['JWT_SECRET'])) {
        return false;
    }
    $secret_key = $_ENV['JWT_SECRET'];
    
    $validSig = str_replace(['+','/','='], ['-','_',''], base64_encode(hash_hmac('sha256', "$header.$payload", $secret_key, true)));
    $payloadDecoded = json_decode(base64_decode($payload), true);
    
    if($signature === $validSig && $payloadDecoded['exp'] >= time()) {
        return $payloadDecoded['user_id'];
    }
    
    return false;
}