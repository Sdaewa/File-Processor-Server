const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const libre = require("libreoffice-convert");
const request = require("request");

require("dotenv").config({ path: ".env" });
const app = express();
const port = 8000;
const pathTo = path.resolve(__dirname, "files");
const fileArr = fs.readdirSync(pathTo);
const fileNameExt = fileArr[0];
const fileName = path.basename(fileNameExt, ".doc" || ".docx");
const extend = ".pdf";
const enterPath = path.join(__dirname, `/files/${fileNameExt}`);
const outputPath = path.join(__dirname, `/files/${fileName}${extend}`);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");
// const filesPath = path.join(__dirname + "/files");

app.use(cors());

app.get("/convert", (req, res) => {
  // Read file
  const file = fs.readFileSync(enterPath);
  // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
  libre.convert(file, extend, undefined, (err, done) => {
    if (err) {
      console.log(`Error converting file: ${err}`);
    }
    // Here in done you have pdf file which you can save or transfer in another stream
    fs.writeFileSync(outputPath, done);
    res.send(done);
  });
});

app.post("/", (req, res) => {
  fs.access("./files", (error) => {
    if (error) {
      fs.mkdirSync("./files");
    }
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      } else if (err) {
        return res.status(500).json(err);
      }
      res.status(200).send(req.file);
    });
  });
});

var https = require("https");

// Get your own by registering at https://app.pdf.co/documentation/api

// Source PDF file
const SourceFile = enterPath;
// PDF document password. Leave empty for unprotected documents.
const Password = "";
// Destination PDF file name
const DestinationFile = outputPath;

// Prepare URL for `Optimize PDF` API endpoint
var query = `https://api.pdf.co/v1/pdf/optimize`;
let reqOptions = {
  uri: query,
  headers: { "x-api-key": process.env.API_KEY },
  formData: {
    name: path.basename(DestinationFile),
    password: Password,
    file: fs.createReadStream(SourceFile),
  },
};

// Send request
request.post(reqOptions, function (error, response, body) {
  if (error) {
    return console.error("Error: ", error);
  }

  // Parse JSON response
  let data = JSON.parse(body);
  if (data.error == false) {
    // Download PDF file
    var file = fs.createWriteStream(DestinationFile);
    https.get(data.url, (response2) => {
      response2.pipe(file).on("close", () => {
        console.log(`Generated PDF file saved as "${DestinationFile}" file.`);
      });
    });
  } else {
    // Service reported error
    console.log("Error: " + data.message);
  }
});

app.listen(port, () => console.log("Server connected"));
