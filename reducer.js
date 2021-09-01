const fs = require("fs");
require("dotenv").config();

var CloudmersiveConvertApiClient = require("cloudmersive-convert-api-client");

var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance; // Configure API key authorization: Apikey

var Apikey = defaultClient.authentications["Apikey"];

Apikey.apiKey = process.env.CLOUDMERSIVE_API_KEY;

var apiInstance = new CloudmersiveConvertApiClient.EditPdfApi();

var inputFile = Buffer.from(fs.readFileSync("C:\\temp\\inputfile").buffer); // File | Input file to perform the operation on.

var callback = function (error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log("API called successfully. Returned data: " + data);
  }
};
apiInstance.editPdfReduceFileSize(inputFile, callback);
