const fs = require("fs");
const path = require("path");

exports.downloadPdf = (req, res) => {
  const fileName = fs.readdirSync(path.resolve(__dirname, "../files/pdf"));
  const pathToPdf = path.join(__dirname, `../files/pdf/${fileName[0]}`);
  const file = fs.readFileSync(pathToPdf);
  if (!file) {
    return console.log("no file found");
  }
  res.download(pathToPdf, fileName[0]);
  setTimeout(() => {
    fs.unlinkSync(pathToPdf);
  }, 2000);
};
