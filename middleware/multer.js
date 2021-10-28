const multer = require("multer");
const os = require("os");
const path = require("path");
const fs = require("fs");

const prex = "temp-";
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), prex));

exports.storageMiddleware = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, tmpDir);
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

  multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  }).single("file");
};
