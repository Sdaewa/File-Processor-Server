const fs = require("fs");
const path = require("path");
const libre = require("libreoffice-convert");
const cloudinary = require("cloudinary").v2;
require("dotenv").config({ path: ".env" });

// const imageToBase64 = require("image-to-base64");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.upload = (req, res) => {
  console.log(req.file.buffer);
  if (req.file !== undefined) {
    // // fs.readdir(path.join(__dirname, `../files/doc`), function (err, data) {
    //   if (data.length == 0) {
    //     return console.log("Directory is empty!");
    //   }
    const file = fs.readFileSync(req.file.path);
    const extend = ".pdf";
    const fileName = req.file.originalname.split(".")[0];
    const pathToPdf = path.join(__dirname, `../files/pdf/${fileName}.pdf`);

    // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
    libre.convert(file, extend, undefined, (err, done) => {
      if (err) {
        console.log(`Error converting file: ${err}`);
        throw new Error({ error: error });
      }
      // Here in done you have pdf file which you can save or transfer in another stream
      fs.writeFileSync(pathToPdf, done);
      console.log(done);
      const buffer = Buffer.from(done);
      const fileString = buffer.toString("base64");
      const imageData = `data:image/jpeg;base64,${fileString}`;
      cloudinary.uploader
        .upload(imageData)
        .then((result) => {
          console.log("succes");
          response.status(200).send({
            message: "success",
            result,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: "failure",
            error,
          });
        });
      res.send(done);
    });
    // });
  } else {
    res.send("No File selected !");
    res.end();
  }
};

// .get(imageUrl)
// .then((res) => {
//   imageToBase64(res.config.url)
//     .then((response) => {
//       const imageData = `data:image/jpeg;base64,${response}`;
//       cloudinary.uploader
//         .upload(imageData)
//         .then((result) => {
//           console.log("succes");
//           response.status(200).send({
//             message: "success",
//             result,
//           });
//         })
//         .catch((error) => {
//           response.status(500).send({
//             message: "failure",
//             error,
//           });
//         });
