const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const libre = require("libreoffice-convert");
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

app.listen(port, () => console.log("Server connected"));
