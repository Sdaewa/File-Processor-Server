const MailGen = require("mailgen");
const request = require("request").defaults({ encoding: null });
const sg = require("@sendgrid/mail");

require("dotenv").config({ path: ".env" });

const { cloudinary } = require("../utils/cloudinary");

// console.log(fileData);

sg.setApiKey(process.env.SG_KEY);

exports.sendByEmail = (req, res) => {
  const mailGenerator = new MailGen({
    theme: "salted",
    product: {
      name: "PDF Processor",
      link: "https://github.com/sdaewa",
    },
  });

  const email = {
    body: {
      name: "User",
      intro: "Welcome, find attached your PDF file",
    },
  };

  const emailTemplate = mailGenerator.generate(email);
  const { emailAddress } = req.body;

  cloudinary.api
    .resources()
    .then((result) => {
      const url = result.resources[0].url;
      request.get(url, function (err, res, body) {
        const msg = {
          to: emailAddress,
          from: process.env.EMAIL,
          subject: "This is your PDF file 📄",
          text: "and easy to do anywhere, even with Node.js",
          html: emailTemplate,
          attachments: [
            {
              content: body.toString("base64"),
              filename: "file.pdf",
              type: "application/pdf",
              disposition: "attachment",
              content_id: "mytext",
            },
          ],
        };
        sg.send(msg);
      });
    })
    .then(() => {
      res.status(200).json({
        message: "Email sent successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });

  // });
};
