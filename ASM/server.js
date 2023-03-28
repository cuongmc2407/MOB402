const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
const multer = require("multer");

app.use(
  bodyParser.urlencoded({ extended: true })
);

var expressHbs = require("express-handlebars");
var fs = require("fs");
app.use(express.static("public"));

const listUser = [
  {
    id: "1",
    avatar: "",
    email: "admin@admin.com",
    password: "admin",
  },
];

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
    let newFileName =
      arr[0] + Date.now() + "." + arr[1];

    console.log(newFileName);
    cb(null, newFileName);
  },
});

var upload = multer({ storage: storage });

app.engine(
  ".hbs",
  expressHbs.engine({
    extname: "hbs",
    defaultLayout: "login",
    layoutsDir: "views/layouts/",
  })
);

app.set("view engine", ".hbs");
app.set("views", "./views");

app.get("/login", function (req, res) {
  res.render("defaultView", {
    layout: "login",
  });
});

app.post("/login", function (req, res) {
    res.render("defaultView", {
      layout: "login",
    });
  });

app.post("/registration", function (req, res) {
  res.render("defaultView", {
    layout: "registration",
  });
});
app.post("/manager", function (req, res) {
  console.log(req.body);
  for (var i = 0; i < listUser.length; i++) {
    if (
      listUser[i].email == req.body.email &&
      listUser[i].password == req.body.password
    ) {
      res.render("defaultView", {
        layout: "manager",
      });
    }
    else{
        res.render("defaultView", {
            layout: "login",
            result: 'Email or password is not correct',
          });
    }
  }
});

app.post(
  "/upload",
  upload.single("myFile"),
  (req, res, next) => {
    const file = req.file;
    const newUser = {
      id: listUser[listUser.length - 1].id + 1,
      email: req.body.email,
      password: req.body.password,
    };
    listUser.push(newUser);
    result = 'Registration successful';
    if (!file) {
      const error = new Error(
        "Please upload a file"
      );
      error.httpStatusCode = 400;
      result = 'Registration failed';
    }
    res.render("defaultView", {
        layout: "registration",
        result: result,
      });
  }
);

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port}`
  );
});
