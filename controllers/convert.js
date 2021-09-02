// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "files");
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     },
//   });

//   const fileFilter = (req, file, cb) => {
//     if (
//       file.mimetype === "image/png" ||
//       file.mimetype === "image/jpg" ||
//       file.mimetype === "image/pdf" ||
//       file.mimetype === "image/jpeg"
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };

//   const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
//     "file"
//   );
