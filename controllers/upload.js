const convertapi = require("convertapi")(process.env.CONVERT_API);
const { cloudinary } = require("../utils/cloudinary");

require("dotenv").config({ path: ".env" });

exports.upload = (req, res) => {
  if (req.file !== undefined) {
    const file = req.file.buffer;
    const fileName = req.file.originalname;
    const fileString = file.toString("base64");
    const docData = `data:application/msword;base64,${fileString}`;

    cloudinary.uploader
      .upload(docData, {
        public_id: fileName,
        resource_type: "raw",
        // raw_convert: "aspose",
      })
      .then((res) => {
        // cloudinary.url(res.public_id + ".pdf");
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    res.status(200).send();
  } else {
    res.status(500).send();
    res.end();
  }
};
