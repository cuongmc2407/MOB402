const express = require("express");
const app = express();
const cal = require("./calculator");

app.use(express.urlencoded({ extended: true }));

var expressHbs = require("express-handlebars");


app.engine(
  ".hbs",
  expressHbs.engine({
    extname: "hbs",
    defaultLayout: "page2",
    layoutsDir: "views/layouts/",
  })
);

app.set("view engine", ".hbs");
app.set("views", "./views");

// app.get("/", function (req, res) {
//   res.send("Hello World");
// });

app.get("/", function (req, res) {
  res.render("home", {
    layout: "main",
    showContentTinhToan: false,
    showTitle: true,
  });
});

let result = 0;

app.post("/tinhtoan", function (req, res) {

  
  
  const soA = Number(req.body.num1);
  const soB = Number(req.body.num2);
  const operator = req.body.operator;


  switch (operator) {
    case "cong":
      result = cal.add(soA, soB);

      break;
    case "tru":
      result = cal.sub(soA, soB);

      break;
    case "nhan":
      result = cal.mul(soA, soB);

      break;
    case "chia":
      result = cal.div(soA, soB);

      break;
  }

  res.render("defaultView", {
    layout: "Caculator",
    result: result,
    soA: soA,
    soB: soB,
  });
});

app.get("/tinhtoan", function (req, res) {

  res.render("defaultView", {
    layout: "Caculator",
    result: result,
  });
});

app.listen(8080);
