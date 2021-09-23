const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const libre = require("libreoffice-convert");
const request = require("request");
const sg = require("@sendgrid/mail");
const https = require("https");

require("dotenv").config({ path: ".env" });
const app = express();
const port = 8000;
const pathTo = path.resolve(__dirname, "files/pdf");
const fileArr = fs.readdirSync(pathTo);
const fileNameExt = fileArr[0];
const fileNameOnly = fileNameExt.split(".")[0];
const fileName = path.basename(fileNameExt);
const enterPath = path.join(__dirname, `/files/doc/${fileNameOnly}.doc`);
const outputPath = path.join(__dirname, `/files/pdf/${fileName}`);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/doc");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
sg.setApiKey(process.env.SG_KEY);

const upload = multer({ storage: storage }).single("file");
// const filesPath = path.join(__dirname + "/files");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/convertToPdf", (req, res) => {
  const extend = ".pdf";
  // Read file
  const file = fs.readFileSync(enterPath);

  // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
  libre.convert(file, extend, undefined, (err, done) => {
    if (error) {
      console.log(`Error converting file: ${error}`);
      throw new Error({ error: error });
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

pathToAttachment = `${__dirname}/files/pdf/${fileNameExt}`;
attachment = fs.readFileSync(pathToAttachment);

app.post("/sendByEmail", (req, res) => {
  const { emailAddress } = req.body;

  const msg = {
    to: emailAddress,
    from: process.env.EMAIL,
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    attachments: [
      {
        content: attachment.toString("base64"),
        filename: "sample.pdf",
        type: "application/pdf",
        disposition: "attachment",
        content_id: "mytext",
      },
    ],
  };
  sg.send(msg)
    .then((res) => {
      console.log("succes");
    })
    .catch((error) => {
      /* log friendly error */
      console.error(error.toString());
      throw new Error({ error: error });

      /* extract error message */
      const { message, code, response } = error;

      /* extract response message */
      const { headers, body } = response;
    });
  // });
});

// Source PDF file
const SourceFile = path.join(__dirname, `/files/pdf/${fileName}`);
// PDF document password. Leave empty for unprotected documents.
const Password = "";
// Destination PDF file name
const DestinationFile = path.join(__dirname, `/files/minPdf/${fileName}`);

// Prepare URL for `Optimize PDF` API endpoint
var query = process.env.PDF_CO_URL;
let reqOptions = {
  uri: query,
  headers: { "x-api-key": process.env.API_KEY },
  formData: {
    name: path.basename(DestinationFile),
    password: Password,
    file: fs.createReadStream(SourceFile),
  },
};

app.get("/convertToMin", (req, res) => {
  // Send request
  request.post(reqOptions, function (error, res, body) {
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
      throw new Error({ error: data.message });
    }
  });
});

app.listen(port, () => console.log("Server connected"));
