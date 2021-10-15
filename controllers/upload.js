const fs = require("fs");
const path = require("path");
const libre = require("libreoffice-convert");

exports.upload = (req, res) => {
  if (req.file !== undefined) {
    const file = fs.readFileSync(req.file.path);
    fs.readdir(path.join(__dirname, `../files/doc`), function (err, data) {
      if (data.length == 0) {
        return console.log("Directory is empty!");
      }
      const extend = ".pdf";
      const fileName = req.file.originalname.split(".")[0];
      const pathToPdf = path.join(__dirname, `../files/pdf/${fileName}.pdf`);
      const pathToDoc = path.join(__dirname, `../files/doc/${fileName}.doc`);

      // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
      libre.convert(file, extend, undefined, (err, done) => {
        if (err) {
          console.log(`Error converting file: ${err}`);
          throw new Error({ error: error });
        }
        // Here in done you have pdf file which you can save or transfer in another stream
        fs.writeFileSync(pathToPdf, done);
        res.send(done);
        fs.unlinkSync(pathToDoc);
      });
    });
  } else {
    res.send("No File selected !");
    res.end();
  }
};
