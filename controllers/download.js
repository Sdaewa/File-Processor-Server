const axios = require("axios");
const { cloudinary } = require("../utils/cloudinary");

require("dotenv").config({ path: ".env" });

exports.downloadPdf = (req, res) => {
  cloudinary.api
    .resources()
    .then((result) => {
      console.log(result.resources[0].url);
      res.status(200).send({ url: result.resources[0].url });
    })

    .catch(
      (err) => {
        console.log(err);
        res.send(err);
      }
      // cloudinary.api.resources(function (err, res) {
      //   if (err) {
      //     return console.log(err);
      //   }

      //   const url = res.resources[0].url;

      //   axios
      //     .get(url, { responseType: "arraybuffer" })
      //     .then((res) => {
      //       return response.status(200).send({
      //         message: "success",
      //         response: res.data,
      //       });
      //     })
      //     .catch((err) => {
      //       return err;
      //       // console.log(err);
      //     });
      // });
      // res.status(200).send();
    );
};
