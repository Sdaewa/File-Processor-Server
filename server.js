const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const libre = require("libreoffice-convert");
const request = require("request");
const sgMail = require("@sendgrid/mail");
const https = require("https");

// const nodemailer = require("nodemailer");

// const sendGridTransport = require("nodemailer-sendgrid-transport");

require("dotenv").config({ path: ".env" });
const app = express();
const port = 8000;
const pathTo = path.resolve(__dirname, "files/pdf");
const fileArr = fs.readdirSync(pathTo);
const fileNameExt = fileArr[0];
const fileName = path.basename(fileNameExt, ".doc" || ".docx");
const enterPath = path.join(__dirname, `/files/doc/${fileNameExt}`);
const outputPath = path.join(__dirname, `/files/pdf/${fileName}`);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/doc");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
sgMail.setApiKey(process.env.SG_KEY);

const upload = multer({ storage: storage }).single("file");
// const filesPath = path.join(__dirname + "/files");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/convertToPdf", (req, res) => {
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
  fs.access("./files/doc", (error) => {
    if (error) {
      fs.mkdirSync("./files/doc");
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

app.post("/sendByEmail", (req, res) => {
  const { emailAddress } = req.body;

  const msg = {
    to: emailAddress,
    from: process.en,
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    attachments: [
      {
        content: fileNameExt,
        filename: "attachment.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
});

// Source PDF file
const SourceFile = path.join(__dirname, `/files/pdf/${fileName}`);
// PDF document password. Leave empty for unprotected documents.
const Password = "";
// Destination PDF file name
const DestinationFile = path.join(__dirname, `/files/minPdf/${fileName}`);

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

app.get("/convertToMin", (req, ers) => {
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
});

app.listen(port, () => console.log("Server connected"));
