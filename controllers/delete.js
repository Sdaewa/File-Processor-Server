const fs = require("fs");
const path = require("path");

exports.delete = (req, res) => {
  const fileName = fs.readdirSync(path.resolve(__dirname, "../files/pdf"));
  const pathToPdf = path.join(__dirname, `../files/pdf/${fileName[0]}`);
  const thereIsFile = fs.existsSync(pathToPdf);

  if (!thereIsFile) {
    res.sendStatus(404);
    return;
  }
  res.sendStatus(200);
  fs.unlinkSync(pathToPdf);
};
