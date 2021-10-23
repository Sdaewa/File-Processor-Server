const fs = require("fs");
const libre = require("libreoffice-convert");
const cloudinary = require("cloudinary").v2;

require("dotenv").config({ path: ".env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.upload = (req, res) => {
  if (req.file !== undefined) {
    const file = fs.readFileSync(req.file.path);

    const extend = ".pdf";
    // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
    libre.convert(file, extend, undefined, (err, done) => {
      if (err) {
        console.log(`Error converting file: ${err}`);
        throw new Error({ error: error });
      }

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
  } else {
    res.send("No File selected !");
    res.end();
  }
};
