fetch('getconfig.php')
  .then(response => response.json())
  .then(config => {
    // Access the parameters from the retrieved JSON data
    let fileSizeLimit = config.fileSizeLimit; // 1 mB = 1 * 1024 * 1024
    let programPath = config.programPath;
    let insertTimeStamp = config.insertTimeStamp; // true : there is a timestamp added to the file name. False : the filename is unchanged.

    // check the parameters in the console
    console.log(fileSizeLimit);
    console.log(programPath);
    console.log(insertTimeStamp);

    // Add event listeners for drag and drop functionality
    let uploadContainer = document.getElementById('uploadContainer');
    uploadContainer.addEventListener('dragover', handleDragOver);
    uploadContainer.addEventListener('drop', handleDrop);

    //
    //  MAIN FUNCTION HERE - UPLOAD THE FILE
    //
    function uploadFileWithSizeLimit(file) {

      // cleaning the html
      clearLinks();
      clearStatus();
      clearQRcode();

      if (typeof file.name === 'undefined') {
        // If file is undefined, use the file from the file input
        let fileInput = document.getElementById('fileInput');
        file = fileInput.files[0];
      }

      if (!file) { // if no file is chosen, update status and stop
        displayStatus('Please choose a file to upload.');
        return;
      }

      // Check file size
      if (file.size > fileSizeLimit) {
        displayStatus('File size exceeds the limit of 1MB.'); // this value needs to be updated if the config.json file is changed
        return;
      }

      // Validate filename using regular expression
      let filenameRegex = /^[a-zA-Z0-9-_ .]+$/;
      if (!filenameRegex.test(file.name)) {
        displayStatus('Invalid filename. Please use letters, numbers, hyphens, underscores, and spaces only.');
        return;
      }

      let formData = new FormData();
      let timestamp = getTimeStamp(); // Get the timestamp string

      // Modify the filename if insertTimeStamp is true
      if (insertTimeStamp) {
        let originalFileName = file.name;
        let fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
        let baseFileName = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
        let newFileName = baseFileName + '_' + timestamp + fileExtension;
        file = new File([file], newFileName); // Create a new File object with the updated filename
      }

      formData.set('file', file); // Set the updated file in the form data

      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'upload.php', true); // sends the file to upload.php,
      xhr.onload = function () {
        let response = xhr.responseText; // this is the text send by the 'echo' instruction in the upload.php file
        displayStatus(response);
        if (xhr.status === 200) { // xhr.status === 200 upload successful (see upload.php)   
          let fileUrlComputer = programPath + "uploads/" + file.name; // display the links and QRcode
          displayComputerFileLink(fileUrlComputer);
          displayPhyphoxFileLink(fileUrlComputer);
        }
      };
      xhr.send(formData);
    }

    // Add an event listener for the file input change event
    let fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function () {
      let file = fileInput.files[0];
      uploadFileWithSizeLimit(file);
    });


    function handleDrop(event) { //handle the drag and drop
      event.preventDefault();

      // clear the input file
      let fileInput = document.getElementById('fileInput');
      fileInput.value = '';

      // Call the uploadFileWithSizeLimit function with the selected file
      uploadFileWithSizeLimit(event.dataTransfer.files[0]);
    }

    function handleDragOver(event) {
      event.preventDefault();
    }

    function getTimeStamp() {
      let now = new Date();
      let year = now.getFullYear();
      let month = addZero(now.getMonth() + 1);
      let day = addZero(now.getDate());
      let hour = addZero(now.getHours());
      let minute = addZero(now.getMinutes());
      let second = addZero(now.getSeconds());
      return year + '_' + month + '_' + day + '_' + hour + '_' + minute + '_' + second;
    }

    function addZero(value) {
      return value < 10 ? '0' + value : value;
    }

    function clearLinks() { // clear the html elements
      let fileLinkContainer1 = document.getElementById('computerFileLinkContainer');
      fileLinkContainer1.innerHTML = '';
      let fileLinkContainer2 = document.getElementById('phyphoxFileLinkContainer');
      fileLinkContainer2.innerHTML = '';
    }

    function clearStatus() { // clear the html elements
      let statusContainer = document.getElementById('statusContainer');
      // Remove any existing content
      statusContainer.innerHTML = '';
    }

    function clearQRcode() { // clear the html elements
      let qrCodeContainer = document.getElementById('qrCodeContainer');
      // Clear previous QR code if any
      qrCodeContainer.innerHTML = '';
    }

    function displayComputerFileLink(fileUrl) { // display the link for computers
      let fileLinkContainer = document.getElementById('computerFileLinkContainer');

      // Remove any existing content
      fileLinkContainer.innerHTML = '';

      // Create a paragraph element for the additional text
      let additionalText = document.createElement('p');
      additionalText.textContent = 'Click the following link to access the uploaded file via a computer: ';

      let fileLink = document.createElement('a');
      fileLink.href = fileUrl;
      fileLink.textContent = fileUrl;
      fileLink.target = '_blank';

      // Append the link to the paragraph
      additionalText.appendChild(fileLink);

      // Append the paragraph to the container
      fileLinkContainer.appendChild(additionalText);
    }

    function displayPhyphoxFileLink(fileUrl) { // display the link for phyphox and the QRcode
      let fileLinkContainer = document.getElementById('phyphoxFileLinkContainer');

      // modification of the link      
      let phyphoxUrl = fileUrl.replace(/^https:/, "phyphox:");
      phyphoxUrl = phyphoxUrl.replace(/^http:/, "phyphox:");

      // Remove any existing content
      fileLinkContainer.innerHTML = '';

      // Create a paragraph element for the additional text
      let additionalText = document.createElement('p');
      additionalText.textContent = 'Click the following link to open the uploaded file with phyphox on a smartphone (or use the QRcode below): ';

      let fileLink = document.createElement('a');
      fileLink.href = phyphoxUrl;
      fileLink.textContent = phyphoxUrl;
      fileLink.target = '_blank';

      // Append the link to the paragraph
      additionalText.appendChild(fileLink);

      // Append the paragraph to the container
      fileLinkContainer.appendChild(additionalText);
      generateQRCode(phyphoxUrl);
    }

    function displayStatus(strStatus) { // update the HTML on the status of the upload
      let statusContainer = document.getElementById('statusContainer');

      // Remove any existing content
      statusContainer.innerHTML = '';

      let statusText = document.createElement('p');
      statusText.textContent = strStatus;

      statusContainer.appendChild(statusText);
    }

    function generateQRCode(text) {


      // Create a div element
      var divElement = document.createElement("div");

      // Set the div's background color, padding, height, and width
      divElement.style.backgroundColor = "white";
      divElement.style.padding = "30px";
      divElement.style.height = "256px";
      divElement.style.width = "256px";

      // Set the div's id
      divElement.id = "inserted-div";

      // Find the parent div by its ID
      var container = document.getElementById("qrCodeContainer");

      // Append the div to the container div
      container.appendChild(divElement);


      let qrCodeContainer = document.getElementById('inserted-div');

      // Clear previous QR code if any
      qrCodeContainer.innerHTML = '';

      // Create new QR code instance
      let qrCode = new QRCode(qrCodeContainer, {
        text: text,
        width: 256,
        height: 256,
        padding: 30,
      });




      // Generate the download button
      generateDownloadButton(text);



    }




    // this button downloads the qrcode
    function generateDownloadButton(fileUrl) {
      let qrCodeContainer = document.getElementById('qrCodeContainer');
      let originalFileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1); // Extract the original file name from the URL

      // Create a download button
      let downloadButton = document.createElement('button');
      downloadButton.textContent = 'Download QR Code';
      downloadButton.addEventListener('click', function () {
        let qrCodeImage = qrCodeContainer.querySelector('img');
        let link = document.createElement('a');
        link.href = qrCodeImage.src;
        link.download = 'QRcode_' + originalFileName + '.png'; // Include the original file name in the downloaded file name
        link.click();
      });

      // Append the download button to the QR code container
      qrCodeContainer.appendChild(downloadButton);
    }



    // assign the function to the uploadButton's onclick event
    let uploadButton = document.getElementById('uploadButton');
    uploadButton.addEventListener('click', uploadFileWithSizeLimit);

  }) // end of fetch getconfig.php
  .catch(error => {
    console.error('Error loading config', error);
  });