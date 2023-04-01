const express = require("express");
const app = express();
const port = 8080;

const mongoose = require("mongoose");

const uri =
  "mongodb+srv://cuongmc:Cuong2003@cluster0.8jwy9nc.mongodb.net/cp17301?retryWrites=true&w=majority";

const NhanVienModel = require("./NhanVienModel");

app.use(express.urlencoded({ extended: true }));

var expressHbs = require("express-handlebars");
var ObjectId = require('mongodb').ObjectId;


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

async function addNV(req, res){
  const nv = new NhanVienModel(req.body);
  console.log(nv);
  try {
    await nv.save();
  } catch (error) {
    res.status(500).send(error);
  }
}

function editNV(req, res){

  console.log(req.body);
  NhanVienModel.updateOne({req: req.params}, {req: req.body});
}

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

app.post("/", async (req, res) => {
  await mongoose.connect(uri);

  if(req.body.id == ''){
    //add user
    addNV(req, res);
  }else{
    //update user
    NhanVienModel.findByIdAndUpdate(req.body.id,req.body, (err, data) => {
      res.redirect('/');
    })
  }

  

  let arrNV = await NhanVienModel.find();

  res.render("defaultView", {
    layout: "index",
    arrNV: arrNV.map((arrNV) => arrNV.toJSON()),
  });
});

app.get("/edit/:id", async (req, res) => {
  await mongoose.connect(uri);

  const nv = await NhanVienModel.findOne({_id: req.params.id});
  res.render("defaultView", {
    layout: "edit",
    ten: nv.ten,
    diachi: nv.diachi,
    luong: nv.luong,
    id: nv._id,
  })
  
});

app.get("/add", async (req, res) => {
  res.render("defaultView", {
    layout: "add",
  });
});
app.get("/delete/:id", async (req, res) => {

  await mongoose.connect(uri);

  NhanVienModel.deleteOne({_id: req.params.id} ,function (err,res) {

    console.log('delete success');
    res.redirect('/');
});

  
});

app.listen(port);
