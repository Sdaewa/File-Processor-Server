const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const { PDFNet } = require("@pdftron/pdfnet-node");
// const mimeType = require("./modules/mimeType");
require("dotenv").config({ path: "./.env" });

const app = express();
const port = 8000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/pdf" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
  "file"
);

app.use(cors());

const filesPath = path.join(__dirname + "/files");

app.get("/convert/:filename", (req, res) => {
  const filename = req.params.filename;
  let ext = path.parse(filename).ext;

  const inputPath = path.resolve(__dirname, filesPath, filename);
  const outputPath = path.resolve(__dirname, filesPath, `${filename}.pdf`);

  if (ext === ".pdf") {
    res.statusCode = 500;
    res.end(`File is already PDF.`);
  }

  const main = async () => {
    const pdfdoc = await PDFNet.PDFDoc.create();
    await pdfdoc.initSecurityHandler();
    await PDFNet.Convert.toPdf(pdfdoc, inputPath);
    pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
  };

  PDFNetEndpoint(main, outputPath, res);
});

// app.post("/convert", function (req, res) {
//   fs.access("./files", (error) => {
//     if (error) {
//       fs.mkdirSync("./files");
//     }
//     upload(req, res, function (err) {
//       if (err instanceof multer.MulterError) {
//         return res.status(500).json(err);
//       } else if (err) {
//         return res.status(500).json(err);
//       }
//       return res.status(200).send(req.file);
//     });
//   });
// });

app.listen(port, () => console.log("Server connected"));
