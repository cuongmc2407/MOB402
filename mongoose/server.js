const express = require("express");
const app = express();
const port = 8080;

const mongoose = require("mongoose");

const uri =
  "mongodb+srv://cuongmc:Cuong2003@cluster0.8jwy9nc.mongodb.net/cp17301?retryWrites=true&w=majority";

const NhanVienModel = require("./NhanVienModel");

app.use(express.urlencoded({ extended: true }));

var expressHbs = require("express-handlebars");
var ObjectId = require("mongodb").ObjectId;

app.engine(
  ".hbs",
  expressHbs.engine({
    extname: "hbs",
    defaultLayout: "index",
    layoutsDir: "views/layouts/",
  })
);

app.set("view engine", ".hbs");
app.set("views", "./views");


app.get("/", async (req, res) => {
  await mongoose.connect(uri);
  console.log("ket noi db thanh cong");

  let arrNV = await NhanVienModel.find();

  // console.log(arrNV);

  res.render("defaultView", {
    layout: "index",
    arrNV: arrNV.map((arrNV) => arrNV.toJSON()),
  });
});

app.post("/add", async (req, res) => {
  await mongoose.connect(uri);  
    const nv = new NhanVienModel(req.body);
    console.log(nv);
    try {
      await nv.save();
    } catch (error) {
      res.status(500).send(error);
    }

  res.redirect('/');
});

app.post("/edit", async (req, res) => {
  await mongoose.connect(uri);  
  //update user
  console.log(req.body.id);
  const nv = await NhanVienModel.findOne({
    _id: req.body.id,
  });

  NhanVienModel.updateOne(nv, req.body).then();


  res.redirect('/');
});

app.get("/edit/:id", async (req, res) => {
  await mongoose.connect(uri);

  const nv = await NhanVienModel.findOne({
    _id: req.params.id,
  });
  res.render("defaultView", {
    layout: "edit",
    ten: nv.ten,
    diachi: nv.diachi,
    luong: nv.luong,
    id: nv._id,
  });
});

app.get("/add", async (req, res) => {
  res.render("defaultView", {
    layout: "add",
  });
});
app.get("/delete/:id", async (req, res) => {
  await mongoose.connect(uri);

  console.log(req.params.id);

  NhanVienModel.deleteOne({
    _id: req.params.id,
  }).then();
  res.redirect("/");
});

app.listen(port);
