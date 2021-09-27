const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const libre = require("libreoffice-convert");
var docxConverter = require("docx-pdf");
const request = require("request");
const sg = require("@sendgrid/mail");
const https = require("https");

require("dotenv").config({ path: ".env" });
sg.setApiKey(process.env.SG_KEY);

const app = express();
const port = 8000;

const pathTo = path.resolve(__dirname, "files/doc");
const fileArr = fs.readdirSync(pathTo);
console.log(fileArr);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/doc");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/downloadPdf", (req, res) => {
  const fileName = fileArr[0].split(".")[0];
  const pathToDoc = path.join(__dirname, `/files/doc/${fileName}.doc`);

  const file = fs.readFileSync(pathToDoc);
  if (!file) {
    return console.log("no file found");
  }
  res.send(file);
});

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  // fs.access("./files/doc", (error) => {
  //   if (error) {
  //     fs.mkdirSync("./files/doc");
  //   }
  //   upload(req, res, function (err) {
  //     if (err instanceof multer.MulterError) {
  //       return res.status(500).json(err);
  //     } else if (err) {
  //       return res.status(500).json(err);
  //     }
  //     res.status(200).send(req.file);
  //   });
  // });
  const file = fs.readFileSync(req.file.path);
  if (file) {
    fs.readdir(path.join(__dirname, `/files/pdf/`), function (err, data) {
      if (data.length == 0) {
        return console.log("Directory is empty!");
      }
      const extend = ".pdf";
      const fileName = req.file.originalname.split(".")[0];
      const pathToPdf = path.join(__dirname, `/files/pdf/${fileName}.pdf`);

      // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
      libre.convert(file, extend, undefined, (err, done) => {
        if (err) {
          console.log(`Error converting file: ${err}`);
          throw new Error({ error: error });
        }
        // Here in done you have pdf file which you can save or transfer in another stream
        fs.writeFileSync(pathToPdf, done);
        res.send(done);
      });
    });
  }
});

app.post("/upload", function (req, res) {
  if (req.files.upfile) {
    (name = file.name), (type = file.mimetype);
    //File where .docx will be downloaded
    var uploadpath = __dirname + "/uploads/" + name;
    //Name of the file --ex test,example
    const First_name = name.split(".")[0];
    //Name to download the file
    down_name = First_name;
    //.mv function will be used to move the uploaded file to the
    //upload folder temporarily
    file.mv(uploadpath, function (err) {
      if (err) {
        console.log(err);
      } else {
        //Path of the downloaded or uploaded file
        var initialPath = path.join(
          __dirname,
          `./uploads/${First_name}${extend_docx}`
        );
        //Path where the converted pdf will be placed/uploaded
        var upload_path = path.join(
          __dirname,
          `./uploads/${First_name}${extend_pdf}`
        );
        //Converter to convert docx to pdf -->docx-pdf is used
        //If you want you can use any other converter
        //For example -- libreoffice-convert or --awesome-unoconv
        docxConverter(initialPath, upload_path, function (err, result) {
          if (err) {
            console.log(err);
          }
          console.log("result" + result);
          res.sendFile(__dirname + "/down_html.html");
        });
      }
    });
  } else {
    res.send("No File selected !");
    res.end();
  }
});

app.post("/sendByEmail", (req, res) => {
  const fileName = fileArr[0].split(".")[0];
  const pathToPdf = path.join(__dirname, `/files/pdf/${fileName}.pdf`);
  attachment = fs.readFileSync(pathToPdf);
  console.log(attachment);
  const { emailAddress } = req.body;

  const msg = {
    to: emailAddress,
    from: process.env.EMAIL,
    subject: "This is your PDF file 📄",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    attachments: [
      {
        content: attachment.toString("base64"),
        filename: `${fileName}.pdf`,
        type: "application/pdf",
        disposition: "attachment",
        content_id: "mytext",
      },
    ],
  };
  sg.send(msg)
    .then((response) => {
      res.sendStatus(response[0].statusCode);
    })
    .catch((error) => {
      /* log friendly error */
      console.error(error.toString());
      // throw new Error({ error: error });

      /* extract error message */
      // const { message, code, response } = error;

      /* extract response message */
      // const { headers, body } = response;
    });
  // });
});

var query = process.env.PDF_CO_URL;

app.get("/convertToMin", (req, res) => {
  const fileName = fileArr[0].split(".")[0];
  const pathToPdf = path.join(__dirname, `/files/minPdf/${fileName}.pdf`);
  const pathToMin = path.join(__dirname, `/files/minPdf/${fileName}.pdf`);

  let reqOptions = {
    uri: query,
    headers: { "x-api-key": process.env.API_KEY },
    formData: {
      name: path.basename(pathToPdf),
      file: fs.createReadStream(pathToPdf),
    },
  };

  // Send request
  request.post(reqOptions, function (error, res, body) {
    // Parse JSON response
    let data = JSON.parse(body);
    if (data.error == false) {
      // Download PDF file
      var file = fs.createWriteStream(pathToPdf);
      https.get(data.url, (response2) => {
        response2.pipe(file).on("close", () => {
          console.log(`Generated PDF file saved as "${pathToMin}" file.`);
        });
      });
    } else {
      // Service reported error
      console.log("Error: " + data.message);
      // throw new Error({ error: data.message });
    }
  });
});

app.listen(port, () => console.log("Server connected"));
