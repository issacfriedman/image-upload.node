var express = require("express");
var multer = require("multer");
const cors = require("cors");
const fs = require('fs')
!fs.existsSync(`./uploads`) && fs.mkdirSync(`./uploads`, { recursive: true })

const port = process.env.PORT || 8888;

var app = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });
app.use(
  cors({
    origin: "*",
  })
);

/*
app.use('/a',express.static('/b'));
Above line would serve all files/folders inside of the 'b' directory
And make them accessible through http://localhost:3000/a.
*/
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

app.post(
  "/profile-upload-single",
  upload.single("profile-file"),
  function (req, res, next) {
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    console.log(JSON.stringify(req.file));
    var response = '<a href="/">Home</a><br>';
    response += "Files uploaded successfully.<br>";
    response += `<img src="${req.file.path}" /><br>`;
    return res.send(response);
  }
);

app.post(
  "/profile-upload-multiple",
  upload.array("file", 12),
  function (req, res, next) {
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any

    for (var i = 0; i < req.files.length; i++) {
      var response = `${req.protocol}://${req.get("host")}/uploads/${
        req.files[i].filename
      }`;
    }

    return res.send(response);
  }
);

app.listen(port, () => console.log(`Server running on port ${port}!`));
