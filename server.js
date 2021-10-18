const express = require("express");
const multer = require("multer");
const cors = require("cors");

require("dotenv").config({ path: ".env" });

const deleteRoutes = require("./routes/delete");
const uploadRoutes = require("./routes/upload");
const downloadRoutes = require("./routes/download");
const minPdfRoutes = require("./routes/minPdf");
const sendEmailRoutes = require("./routes/sendEmail");

const PORT = process.env.PORT || 8080;
const app = express();
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

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested, Content-Type, Accept Authorization"
//   );
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE");
//     return res.status(200).json({});
//   }
// });

app.use(uploadRoutes);
app.use(downloadRoutes);
app.use(minPdfRoutes);
app.use(sendEmailRoutes);
app.use(deleteRoutes);

app.listen(PORT, () => console.log(`Server connected in ${PORT}`));
