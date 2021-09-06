const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config({ path: ".env" });

const CloudmersiveConvertApiClient = require("cloudmersive-convert-api-client");
const defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
const Apikey = defaultClient.authentications["Apikey"];
Apikey.apiKey = process.env.API_KEY;

const apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi();

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

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "application/msword" ||
//     file.mimetype === "application/vnd.ms-word.document.macroEnabled.12" ||
//     file.mimetype ===
//       "	application/vnd.openxmlformats-officedocument.wordprocessingml.template" ||
//     file.mimetype ===
//       "	application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
//     file.mimetype === "application/pdf"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const upload = multer({ storage: storage }).single("file");

app.use(cors());

app.use("/files", express.static("files"));

const filesPath = path.join(__dirname + "/files");

// app.get("/convert", (req, res) => {
//   console.log(filename);
//   //   let ext = path.parse(filename).ext;

//   //   if (ext === ".pdf") {
//   //     res.statusCode = 500;
//   //     res.end(`File is already PDF.`);
//   //   }

//   const convertToPdf = async () => {
//     const pdfdoc = await PDFNet.PDFDoc.create();
//     await pdfdoc.initSecurityHandler();
//     await PDFNet.Convert.toPdf(pdfdoc, inputPath);
//     pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
//   };

//   PDFNet.runWithCleanup(convertToPdf, process.env.API_KEY)
//     .then(() => {
//       fs.readFile((e, data) => {
//         if (e) {
//           res.status(500);
//           res.send(e);
//         } else {
//   res.setHeader({ "Content-Type": "application/pdf" });
//   res.send({ data });
//           PDFNet.shutdown();
//         }
//       });
//     })
//     .catch((e) => {
//       res.status(500);
//       res.send(e);
//       console.log(e);
//     });
// });

app.get("/convert", (req, res) => {
  const { filename } = req.query;
  // console.log(filename);

  // var scriptName = path.basename("./files" + __filename);
  // console.log(scriptName);

  // const files = fs.readdirSync("./files", __filename);

  // for (const file of files) {
  //   console.log(file);
  // }
  const inputPath = path.resolve(__dirname, `./files/${filename}`);

  console.log(inputPath);
  const inputFile = inputPath; // File | Input file to perform the operation on.

  const callback = (error, data, req, res) => {
    if (error) {
      console.error(error);
    } else {
      console.log("API called successfully. Returned data: " + data);
      const encoded = new Buffer.from(data).toString("base64");
      var enconded = fs.createWriteStream(inputPath);
      console.log("enconded=>", enconded);
    }
  };

  apiInstance.convertDocumentAutodetectToPdf(inputFile, callback);
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
      return res.status(200).send(req.file);
    });
  });
});

app.listen(port, () => console.log("Server connected"));

// const libre = require("libreoffice-convert");

// var outputFilePath;

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

// app.get("/convert", (req, res) => {
//   res.send("docxtopdfdemo", {
//     title: "DOCX to PDF Converter - Free Media Tools",
//   });
// });

// const docxtopdfdemo = function (req, file, callback) {
//   var ext = path.extname(file.originalname);
//   if (ext !== ".docx" && ext !== ".doc") {
//     return callback("This Extension is not supported");
//   }
//   callback(null, true);
// };

// const docxtopdfdemoupload = multer({
//   storage: storage,
//   fileFilter: docxtopdfdemo,
// });

// app.post("/convert", docxtopdfdemoupload.single("file"), (req, res) => {
//   if (req.file) {
//     console.log(req.file.path);

//     const file = fs.readFileSync(req.file.path);

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

// app.listen(PORT, () => {
//   console.log(`App is listening on Port ${PORT}`);
// });
