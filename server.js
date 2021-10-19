const express = require("express");
const multer = require("multer");
const cors = require("cors");
const aws = require("aws-sdk");

require("dotenv").config({ path: ".env" });
aws.config.region = "us-east-1";

const deleteRoutes = require("./routes/delete");
const uploadRoutes = require("./routes/upload");
const downloadRoutes = require("./routes/download");
const minPdfRoutes = require("./routes/minPdf");
const sendEmailRoutes = require("./routes/sendEmail");

const PORT = process.env.PORT || 8080;
const app = express();
const maxSize = 1 * 1000 * 1000;
const S3_BUCKET = process.env.S3_BUCKET;

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

app.use(uploadRoutes);
app.use(downloadRoutes);
app.use(minPdfRoutes);
app.use(sendEmailRoutes);
app.use(deleteRoutes);

app.listen(PORT, () => console.log(`Server connected in ${PORT}`));
