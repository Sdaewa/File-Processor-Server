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
  const fileName = fs.readdirSync(path.resolve(__dirname, "files/pdf"));
  const pathToPdf = path.join(__dirname, `/files/pdf/${fileName[0]}`);
  const file = fs.readFileSync(pathToPdf);
  if (!file) {
    return console.log("no file found");
  }
  fs.unlinkSync(pathToPdf);
  res.send(file);
});

app.post("/upload", upload.single("file"), (req, res) => {
  // fs.access("./files/doc", (error) => {
  //   if (error) {
  //     fs.mkdirSync("./files/doc");
  //   }
  if (req.file !== undefined) {
    const file = fs.readFileSync(req.file.path);
    fs.readdir(path.join(__dirname, `/files/doc/`), function (err, data) {
      if (data.length == 0) {
        console.log(data);
        return console.log("Directory is empty!");
      }
      const extend = ".pdf";
      const fileName = req.file.originalname.split(".")[0];
      const pathToPdf = path.join(__dirname, `/files/pdf/${fileName}.pdf`);
      const pathToDoc = path.join(__dirname, `/files/doc/${fileName}.doc`);

      // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
      libre.convert(file, extend, undefined, (err, done) => {
        if (err) {
          console.log(`Error converting file: ${err}`);
          throw new Error({ error: error });
        }
        // Here in done you have pdf file which you can save or transfer in another stream
        fs.writeFileSync(pathToPdf, done);
        res.send(done);
        fs.unlinkSync(pathToDoc);
      });
    });
  } else {
    res.send("No File selected !");
    res.end();
  }
});

app.post("/delete", (req, res) => {
  const fileName = fs.readdirSync(path.resolve(__dirname, "files/pdf"));
  const pathToPdf = path.join(__dirname, `/files/pdf/${fileName[1]}`);
  const thereIsFile = fs.existsSync(pathToPdf);

  if (!thereIsFile) {
    // res.sendStatus(404);
    // throw new Error({
    //   message: "Nothing to delete",
    // });
    return;
  }
  fs.unlinkSync(pathToPdf);
});

app.post("/sendByEmail", (req, res) => {
  const fileName = fs.readdirSync(path.resolve(__dirname, "files/pdf"));
  const pathToPdf = path.join(__dirname, `/files/pdf/${fileName[1]}`);
  attachment = fs.readFileSync(pathToPdf);
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
      fs.unlinkSync(pathToPdf);
      res.sendStatus(response[0].statusCode);
    })
    .catch((error) => {
      /* log friendly error */
      console.error(error.toString());
      // throw new Error({ error: error });
    });
  // });
});

app.get("/convertToMin", (req, res) => {
  console.log(req);
  const fileName = fs.readdirSync(path.resolve(__dirname, "files/pdf"));
  const pathToPdf = path.join(__dirname, `/files/pdf/${fileName[0]}`);
  const pathToMin = path.join(__dirname, `/files/minPdf/${fileName[0]}`);

  let reqOptions = {
    uri: process.env.PDF_CO_URL,
    headers: { "x-api-key": process.env.API_KEY },
    formData: {
      name: path.basename(pathToPdf),
      file: fs.createReadStream(pathToPdf),
    },
  };

  // Send request
  request.post(reqOptions, function (error, res, body) {
    // Parse JSON response
    let data = JSON.parse(body);
    if (data.error == false) {
      // Download PDF file
      const file = fs.createWriteStream(pathToPdf);
      https.get(data.url, (response2) => {
        response2.pipe(file).on("close", () => {
          console.log(`Generated PDF file saved as "${pathToMin}" file.`);
        });
        fs.unlinkSync(pathToPdf);
        fs.unlinkSync(pathToMin);
      });
    } else {
      // Service reported error

      console.log("Error: " + data.message);
      // throw new Error({ error: data.message });
    }
  });
});

app.listen(port, () => console.log("Server connected"));
