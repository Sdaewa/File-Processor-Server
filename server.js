const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const base64 = require("base64topdf");
const libre = require("libreoffice-convert");
require("dotenv").config({ path: ".env" });

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

const extend = ".pdf";
const enterPath = path.join(__dirname, "/files/sample.doc");
const outputPath = path.join(__dirname, `/files/example${extend}`);
console.log(enterPath);
const upload = multer({ storage: storage }).single("file");

app.use(cors());

const filesPath = path.join(__dirname + "/files");
console.log(filesPath);

app.get("/convert", (req, res) => {
  console.log(req);
  // Read file
  const file = fs.readFileSync(enterPath);
  console.log(file);
  // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
  libre.convert(file, extend, undefined, (err, done) => {
    if (err) {
      console.log(`Error converting file: ${err}`);
    }

    // Here in done you have pdf file which you can save or transfer in another stream
    fs.writeFileSync(outputPath, done);
    console.log(done);

    process.exit();
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
      // console.log(req);
      // console.log(req.file);
      // console.log(req.headers);
    });
  });
});

app.listen(port, () => console.log("Server connected"));

// const libre = require("libreoffice-convert");

// let outputFilePath;

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// const PORT = process.env.PORT || 8000;

// app.use(express.static("files"));

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "/files");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const docToPdf = function (req, file, callback) {
//   var ext = path.extname(file.originalname);
//   if (ext !== ".docx" && ext !== ".doc") {
//     return callback("This Extension is not supported");
//   }
//   callback(null, true);
// };

// const docUpload = multer({
//   storage: storage,
//   fileFilter: docToPdf,
// });

// app.get("/convert", docUpload.single("file"), (req, res) => {
//   const { filename } = req.query;

//   const inputPath = path.resolve(__dirname, `./files/${filename}`);
//   console.log(inputPath);
//   console.log(req);
//   if (req.file) {
//     console.log(req.file.path);

//     const file = fs.readFileSync(req.file.path);
//     console.log(file);

//     outputFilePath = Date.now() + "output.pdf";

//     libre.convert(file, ".pdf", undefined, (err, done) => {
//       if (err) {
//         fs.unlinkSync(req.file.path);
//         fs.unlinkSync(outputFilePath);

//         res.send("some error taken place in conversion process");
//       }

//       fs.writeFileSync(outputFilePath, done);

//       res.download(outputFilePath, (err) => {
//         if (err) {
//           fs.unlinkSync(req.file.path);
//           fs.unlinkSync(outputFilePath);

//           res.send("some error taken place in downloading the file");
//         }

//         fs.unlinkSync(req.file.path);
//         fs.unlinkSync(outputFilePath);
//       });
//     });
//   }
// });

// app.post("/", (req, res) => {
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

// app.listen(PORT, () => {
//   console.log(`App is listening on Port ${PORT}`);
// });
