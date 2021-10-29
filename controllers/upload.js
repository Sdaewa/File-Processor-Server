const libre = require("libreoffice-convert");
const { cloudinary } = require("../utils/cloudinary");

require("dotenv").config({ path: ".env" });

exports.upload = (req, res) => {
  if (req.body.data !== undefined) {
    const file = req.body.data;

    const extend = ".pdf";
    // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
    libre.convert(file, extend, undefined, (err, data) => {
      if (err) {
        console.log(`Error converting file: ${err}`);
        throw new Error({ error: error });
      }
      const buffer = Buffer.from(data);
      const fileString = buffer.toString("base64");
      const docData = `data:image/jpeg;base64,${fileString}`;
      cloudinary.uploader
        .upload(docData)
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
      res.status(200).send();
    });
  } else {
    res.status(500).send();
    res.end();
  }
};
