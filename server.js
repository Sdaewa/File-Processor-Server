const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const libre = require("libreoffice-convert");
const request = require("request");
const sg = require("@sendgrid/mail");
const https = require("https");
const MailGen = require("mailgen");
const deleteRoutes = require("./routes/delete");
const uploadRoutes = require("./routes/upload");
const downloadRoutes = require("./routes/download");
const minPdfRoutes = require("./routes/minPdf");
const sendEmailRoutes = require("./routes/sendEmail");

require("dotenv").config({ path: ".env" });
sg.setApiKey(process.env.SG_KEY);

const app = express();
const port = 8000;
const maxSize = 1 * 1000 * 1000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/doc");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "application/vnd.apple.pages" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: maxSize },
  }).single("file")
);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(deleteRoutes);
app.use(uploadRoutes);
app.use(downloadRoutes);
// app.use(minPdfRoutes);
// app.use(sendEmailRoutes);

app.post("/delete", (req, res) => {
  const fileName = fs.readdirSync(path.resolve(__dirname, "files/pdf"));
  const pathToPdf = path.join(__dirname, `/files/pdf/${fileName[0]}`);
  const thereIsFile = fs.existsSync(pathToPdf);

  if (!thereIsFile) {
    res.sendStatus(404);
    return;
  }
  res.sendStatus(200);
  fs.unlinkSync(pathToPdf);
});

app.post("/sendByEmail", (req, res) => {
  const mailGenerator = new MailGen({
    theme: "salted",
    product: {
      name: "PDF Processor",
      link: "https://github.com/sdaewa",
    },
  });

  const email = {
    body: {
      name: "User",
      intro: "Welcome, find attached your PDF file",
    },
  };

  const emailTemplate = mailGenerator.generate(email);
  require("fs").writeFileSync("preview.html", emailTemplate, "utf8");
  const fileName = fs.readdirSync(path.resolve(__dirname, "files/pdf"));
  const pathToPdf = path.join(__dirname, `/files/pdf/${fileName[0]}`);
  attachment = fs.readFileSync(pathToPdf);
  const { emailAddress } = req.body;

  const msg = {
    to: emailAddress,
    from: process.env.EMAIL,
    subject: "This is your PDF file 📄",
    text: "and easy to do anywhere, even with Node.js",
    html: emailTemplate,
    attachments: [
      {
        content: attachment.toString("base64"),
        filename: `${fileName}`,
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
      const file = fs.createWriteStream(pathToMin);
      https.get(data.url, (response2) => {
        response2.pipe(file).on("close", () => {
          console.log(`Generated PDF file saved as "${pathToMin}" file.`);
        });
        fs.unlinkSync(pathToPdf);
        // fs.unlinkSync(pathToMin);
      });
    } else {
      // Service reported error

      console.log("Error: " + data.message);
      // throw new Error({ error: data.message });
    }
  });
});

app.listen(port, () => console.log("Server connected"));
