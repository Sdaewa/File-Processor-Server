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
sg.setApiKey(process.env.SG_KEY);

const app = express();
const port = 8000;

const pathTo = path.resolve(__dirname, "files/doc");
const fileArr = fs.readdirSync(pathTo);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/doc");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/downloadPdf", (req, res) => {
  const fileName = fileArr[0].split(".")[0];
  const pathToDoc = path.join(__dirname, `/files/doc/${fileName}.doc`);

  const file = fs.readFileSync(pathToDoc);
  if (!file) {
    return console.log("no file found");
  }
  res.send(file);
});

app.post("/upload", upload.single("file"), (req, res) => {
  // fs.access("./files/doc", (error) => {
  //   if (error) {
  //     fs.mkdirSync("./files/doc");
  //   }
  //   upload(req, res, function (err) {
  //     if (err instanceof multer.MulterError) {
  //       return res.status(500).json(err);
  //     } else if (err) {
  //       return res.status(500).json(err);
  //     }
  //     res.status(200).send(req.file);
  //   });
  // });
  if (res.statusCode === 200) {
    const extend = ".pdf";
    const fileName = fileArr[0].split(".")[0];
    const pathToDoc = path.join(__dirname, `/files/doc/${fileName}.doc`);
    const pathToPdf = path.join(__dirname, `/files/pdf/${fileName}.pdf`);

    // Read file
    const file = fs.readFileSync(pathToDoc);
    if (!file) {
      return console.log("no file found");
    }

    // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
    libre.convert(file, extend, undefined, (err, done) => {
      if (err) {
        console.log(`Error converting file: ${err}`);
        throw new Error({ error: error });
      }
      // Here in done you have pdf file which you can save or transfer in another stream
      fs.writeFileSync(pathToPdf, done);
      res.send(done);
    });
  }
});

app.post("/sendByEmail", (req, res) => {
  const fileName = fileArr[0].split(".")[0];
  const pathToPdf = path.join(__dirname, `/files/pdf/${fileName}.pdf`);
  attachment = fs.readFileSync(pathToPdf);
  console.log(attachment);
  const { emailAddress } = req.body;

  const msg = {
    to: emailAddress,
    from: process.env.EMAIL,
    subject: "This is your PDF file 📄",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    attachments: [
      {
        content: attachment.toString("base64"),
        filename: `${fileName}.pdf`,
        type: "application/pdf",
        disposition: "attachment",
        content_id: "mytext",
      },
    ],
  };
  sg.send(msg)
    .then((response) => {
      res.sendStatus(response[0].statusCode);
    })
    .catch((error) => {
      /* log friendly error */
      console.error(error.toString());
      // throw new Error({ error: error });

      /* extract error message */
      // const { message, code, response } = error;

      /* extract response message */
      // const { headers, body } = response;
    });
  // });
});

var query = process.env.PDF_CO_URL;

app.get("/convertToMin", (req, res) => {
  const fileName = fileArr[0].split(".")[0];
  const pathToPdf = path.join(__dirname, `/files/minPdf/${fileName}.pdf`);
  const pathToMin = path.join(__dirname, `/files/minPdf/${fileName}.pdf`);

  let reqOptions = {
    uri: query,
    headers: { "x-api-key": process.env.API_KEY },
    formData: {
      name: path.basename(pathToMin),
      file: fs.createReadStream(pathToPdf),
    },
  };

  // Send request
  request.post(reqOptions, function (error, res, body) {
    // Parse JSON response
    let data = JSON.parse(body);
    if (data.error == false) {
      // Download PDF file
      var file = fs.createWriteStream(pathToPdf);
      https.get(data.url, (response2) => {
        response2.pipe(file).on("close", () => {
          console.log(`Generated PDF file saved as "${pathToMin}" file.`);
        });
      });
    } else {
      // Service reported error
      console.log("Error: " + data.message);
      // throw new Error({ error: data.message });
    }
  });
});

app.listen(port, () => console.log("Server connected"));
