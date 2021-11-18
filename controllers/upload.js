const convertapi = require("convertapi")(process.env.CONVERT_API);
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const { cloudinary } = require("../utils/cloudinary");

require("dotenv").config({ path: ".env" });

const S3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.upload = (req, res) => {
  if (req.file !== undefined) {
    const file = req.file.buffer;
    const fileName = req.file.originalname.split(".");
    const fileExt = fileName[fileName.length - 1];

    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${uuidv4()}.${fileExt}`,
      Body: file,
    };

    S3.upload(params)
      .promise()
      .then((res) => {
        return res.Location;
      })
      .then((url) => {
        return convertapi.convert(
          "pdf",
          {
            File: url,
          },
          "doc" || "docx"
        );
      })
      .then((res) => {
        const fileUrl = res.response.Files[0].Url;
        cloudinary.uploader.upload(fileUrl, { folder: "processor" });
      })
      .then(() => {
        return res.status(200).json({ message: "File uploaded successfully" });
      })
      .catch((err) => {
        return res.status(400).json({ message: err.message });
      });
  } else {
    res.status(500).send();
    res.end();
  }
};
