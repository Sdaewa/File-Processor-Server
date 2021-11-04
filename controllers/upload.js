const libre = require("libreoffice-convert");
const { cloudinary } = require("../utils/cloudinary");
const streamifier = require("streamifier");
const fs = require("fs");

require("dotenv").config({ path: ".env" });

exports.upload = (req, res) => {
  console.log(req.file);

  if (req.file !== undefined) {
    // const file = fs.readFileSync(req.body.data, { encoding: "base64" });
    const file = req.file.buffer;
    console.log("file=>", file);
    // const docFile = fs.writeFileSync("file.doc", file);
    // console.log("docFile=>", docFile);

    // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
    const extend = ".pdf";
    libre.convert(file, extend, undefined, (err, data) => {
      if (err) {
        console.log(`Error converting file: ${err}`);
      }
      console.log("data=>", data);
      // const buffer = data;
      // const fileString = buffer.toString("base64");
      const pdfData = `data:application/pdf;base64,${data}`;
      console.log(pdfData);
      cloudinary.uploader
        .upload(pdfData, {
          folder: "processor",
        })
        .then((res) => {
          return response.status(200).send({
            message: "success",
            res,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: "failure",
            error,
          });
        });
      res.status(200).send(data);
    });
  } else {
    res.status(500).send();
    res.end();
  }
};
