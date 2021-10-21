const express = require("express");
const multer = require("multer");
const cors = require("cors");
// const aws = require("aws-sdk");
// var multerS3 = require("multer-s3");

require("dotenv").config({ path: ".env" });

const deleteRoutes = require("./routes/delete");
const uploadRoutes = require("./routes/upload");
const downloadRoutes = require("./routes/download");
const minPdfRoutes = require("./routes/minPdf");
const sendEmailRoutes = require("./routes/sendEmail");

const PORT = process.env.PORT || 8080;
const app = express();
// const S3_BUCKET = process.env.S3_BUCKET;

// const s3Config = new aws.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   Bucket: S3_BUCKET,
//   region: "us-east-1",
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/doc");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// const multerS3Config = multerS3({
//   s3: s3Config,
//   bucket: process.env.S3_BUCKET,
//   metadata: function (req, file, cb) {
//     cb(null, { fieldName: file.fieldname });
//   },
//   key: function (req, file, cb) {
//     console.log(file);
//     cb(null, new Date().toISOString() + "-" + file.originalname);
//   },
// });

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
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  }).single("file")
);

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(uploadRoutes);
app.use(downloadRoutes);
app.use(minPdfRoutes);
app.use(sendEmailRoutes);
app.use(deleteRoutes);

app.listen(PORT, () => console.log(`Server connected in ${PORT}`));
