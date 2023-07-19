<?php

  // Disable DELETE requests
  if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    http_response_code(405);
    exit;
  }


  $targetDirectory = "uploads/";
  $targetFile = $targetDirectory . basename($_FILES['file']['name']);
  $allowedExtensions = array('phyphox', 'zip', '.phyphox', '.zip');
  //$maxFileSize = 1 * 1024 * 1024; // 1MB

  // Get relative path to config file
  $configPath = __DIR__ . '/configs/config.json';

  // Load config 
  $config = json_decode(file_get_contents($configPath), true);

// Get max size
  $maxFileSize = $config['fileSizeLimit'];

  $fileExtension = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
  $fileSize = $_FILES['file']['size'];


  // // Get MIME type from file using finfo
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($_FILES['file']['tmp_name']);

// Define valid MIME types  
$allowedMimeTypes = [
  'text/html',
  'application/zip' 
];

// Check MIME type is in list
if (!in_array($mimeType, $allowedMimeTypes)) {
  http_response_code(400);
  echo "Invalid file type uploaded";
  exit;
}

  // Check if the file extension is allowed
  if (!in_array($fileExtension, $allowedExtensions)) {
    http_response_code(400); // Bad Request
    echo "Error: Only .phyphox and .zip files are allowed.";
    exit();
  }

  // Check if the file size exceeds the limit
  if ($fileSize > $maxFileSize) {
    http_response_code(400); // Bad Request
    echo "Error: File size exceeds the limit! ";
    exit();
  }

  // Sanitize filename
  $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $_FILES['file']['name']);


  if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
    // File uploaded successfully
    http_response_code(200);
    echo "File uploaded successfully.";
  } else {
    // Failed to upload file
    http_response_code(500);
    echo "An error occurred while uploading the file.";
  }
?>



