const express = require("express");
const multer = require("multer");
const cors = require("cors");

require("dotenv").config({ path: ".env" });

const deleteRoutes = require("./routes/delete");
const uploadRoutes = require("./routes/upload");
const downloadRoutes = require("./routes/download");
const minPdfRoutes = require("./routes/minPdf");
const sendEmailRoutes = require("./routes/sendEmail");

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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers");
  next();
});

app.use(deleteRoutes, next());
app.use(uploadRoutes, next());
app.use(downloadRoutes, next());
app.use(minPdfRoutes, next());
app.use(sendEmailRoutes, next());

app.listen(process.env.PORT || 80, () => console.log("Server connected"));
