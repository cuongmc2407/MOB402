const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
const multer = require("multer");

var fs = require("fs");

app.use(
  bodyParser.urlencoded({ extended: true })
);

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    dir = "./uploads";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    let fileName = file.originalname;

    let arr = fileName.split(".");
    // if (
    //   arr[1] == "tiff" ||
    //   arr[1] == "jfif" ||
    //   arr[1] == "bmp" ||
    //   arr[1] == "gif" ||
    //   arr[1] == "png" ||
    //   arr[1] == "jpg" ||
    //   arr[1] == "svgz" ||
    //   arr[1] == "webp" ||
    //   arr[1] == "ico" ||
    //   arr[1] == "xbm" ||
    //   arr[1] == "pjp" ||
    //   arr[1] == "avif"
    // ) {
    //   arr[1] = "jpeg";
    // }
    // if (arr[1] !== 'jpeg') {
    //   arr[1] = 'jpeg';
    // }
    let newFileName =
      arr[0] + Date.now() + "." + arr[1];

    console.log(newFileName);
    cb(null, newFileName);
  },
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.post(
  "/uploadfile",
  upload.single("myFile"),
  (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error(
        "Please upload a file"
      );
      error.httpStatusCode = 400;
      return next(error);
    }
    res.send(file);
  }
);

//Uploading multiple files
app.post(
  "/uploadmultiple",
  upload.array("myFiles", 12),
  (req, res, next) => {
    const files = req.files;
    if (!files) {
      const error = new Error(
        "Please choose files"
      );
      error.httpStatusCode = 400;
      return next(error);
    }
    res.send(files);
  }
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/upload.html");
});

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port}`
  );
});
