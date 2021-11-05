const libre = require("libreoffice-convert");
const { cloudinary } = require("../utils/cloudinary");

require("dotenv").config({ path: ".env" });

exports.upload = (req, res) => {
  if (req.file !== undefined) {
    const file = req.file.buffer;

    // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
    const extend = ".pdf";
    libre.convert(file, extend, undefined, (err, data) => {
      if (err) {
        console.log(`Error converting file: ${err}`);
      }

      const fileString = data.toString("base64");
      const pdfData = `data:application/pdf;base64,${fileString}`;
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
