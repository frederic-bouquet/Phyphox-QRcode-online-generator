<?php


// Path to configs directory 
$configDir = __DIR__ . '/configs';

// Build full path to config.json
$configPath = $configDir . '/config.json';

// Load config file
$config = json_decode(file_get_contents($configPath), true);

// Filter out any sensitive fields
$safeConfig = [
    'fileSizeLimit' => $config['fileSizeLimit'],
    'insertTimeStamp' => $config['insertTimeStamp'],
    'programPath' => $config['programPath'],
    
    // etc...
];

// Output config as JSON  
header('Content-Type: application/json');
echo json_encode($safeConfig);

?>