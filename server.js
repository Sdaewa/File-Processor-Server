const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const mime = require("mime-types");
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
  console.log(filename);
  const inputPath = path.resolve(__dirname, `./files/${filename}`);

  console.log(inputPath);
  const inputFile = inputPath; // File | Input file to perform the operation on.

  const callback = (error, data, req, res) => {
    if (error) {
      console.error(error);
    } else {
      console.log("API called successfully. Returned data: " + data);
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
