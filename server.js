const express = require("express");
const multer = require("multer");
const cors = require("cors");
const os = require("os");
const path = require("path");
const fs = require("fs");

require("dotenv").config({ path: ".env" });

const deleteRoutes = require("./routes/delete");
const uploadRoutes = require("./routes/upload");
const downloadRoutes = require("./routes/download");
const minPdfRoutes = require("./routes/minPdf");
const sendEmailRoutes = require("./routes/sendEmail");

const PORT = process.env.PORT || 8080;
const app = express();
// const prex = "temp-";
// const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), prex));
// const dir = "./database/temp";
// if (!fs.existsSync(tmpDir)) {
//   fs.mkdirSync(dir, {
//     recursive: true,
//   });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, tmpDir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "application/msword" ||
//     file.mimetype ===
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
//     file.mimetype === "application/vnd.apple.pages" ||
//     file.mimetype ===
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
//     file.mimetype === "application/vnd.ms-excel"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb", extended: true }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(uploadRoutes);
app.use(downloadRoutes);
app.use(minPdfRoutes);
app.use(sendEmailRoutes);
app.use(deleteRoutes);

app.listen(PORT, () => console.log(`Server connected in ${PORT}`));
