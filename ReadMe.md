Small html+vanilla javascript and php project.

It allows the upload of a phyphox experiment, and generate a QRcode to share it with other phyphox users.

Phyphox is a smartphone app that allows you to use the sensors in your phone to do experiments. It is open-source and free, developed by Aachen university. See https://phyphox.org/

To install the phyphox qrcode generator:

- copy all the files on a server. You must create the directory "uploads/" and "configs/". 

- update configs/config.json : 
    * you can choose the maximum allowed file size, in bytes (1Mb = 1024*1024) 
    * you MUST update the programPath so that it reflects the web address pointing to the files you have just copied (if you copy paste this address in a browser, you should access the phyphox qrcode generator interface)
    * choose the value of insertTimeStamp: if true a time stamp will be added to the name of the uploaded file, so that all files have a different name. If false, an uploaded file will replace a previous file with the same name. For a shared use, "true" is more prudent to avoid file overwriting. For a solo use "false" allows you to keep the same QRcode even if you make changes the the phyphpox file and re-upload it.

Use proper systemfile permissions for the directories uploads and configs

To contribute:
Any advice on security is welcome.