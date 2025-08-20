<?php
require 'env_loader.php';

// Now, we will check if the JWT_SECRET is available using $_ENV
if (isset($_ENV['JWT_SECRET'])) {
    var_dump($_ENV['JWT_SECRET']);
} else {
    echo 'JWT_SECRET is not set in $_ENV';
}