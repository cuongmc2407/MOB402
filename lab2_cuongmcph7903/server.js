const express = require("express");
const app = express();
const cal = require("./calculator");
app.use(express.static(__dirname));
app.get("/index.htm", function (req, res) {
  res.sendFile(__dirname + "/" + "index.htm");
});
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

var fs = require('fs'); 


app.post("/", (req, res) => {
//   console.log(req.body);
  const soA = Number(req.body.num1);
  const soB = Number(req.body.num2);
  const operator = req.body.operator;

  switch (operator) {
    case "cong":
      const tong = cal.add(soA, soB);
      fs.writeFile('ni.txt', 'This is my text.', function (err) {
        if (err) throw err;
        console.log('Replaced!');
      });
      break;
    case "tru":
      const hieu = cal.sub(soA, soB);
      res.send(
        `Hieu cua ${soA} va ${soB} bang ${hieu}`
      );
      break;
    case "nhan":
      const tich = cal.mul(soA, soB);
      res.send(
        `Tich cua ${soA} va ${soB} bang ${tich}`
      );
      break;
    case "chia":
      const thuong = cal.div(soA, soB);
      res.send(
        `Thuong cua ${soA} va ${soB} bang ${thuong}`
      );
      break;
  }
});

app.listen(8080);
