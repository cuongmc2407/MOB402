var passport = require("passport");
var config = require("../config/database");
require("../config/passport")(passport);
var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var User = require("../models/user.js");
var ProductModel = require("../models/product");
var session = require("express-session");
const multer = require("multer");
var fs = require("fs");

// var Redis = require('ioredis');
// var RedisStore = require('connect-redis')(session);
// const clientRedis = new Redis();

const bodyParser = require("body-parser");

// const request = require("request");

// // parse requests of content-type - application/json

const parser = bodyParser.urlencoded({
  extended: true,
});

router.use(parser);

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    dir = "./public/uploads";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, "./public/uploads");
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

router.use(
  session({
    secret: "keyboard cat",
    // store: new RedisStore({client: clientRedis}),
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      httpOnly: true,
      // maxAge: 15 * 60 * 1000,
    },
  })
);
var isAdmin = false;
var info = {};
// #SIGN UP
const signUpObj = {
  layout: "registration",
  action: "/signup",
};
router.get("/signup", async (req, res) => {
  res.render("defaultView", signUpObj);
});
router.post(
  "/signup",
  upload.single("myFile"),
  async function (req, res) {
    console.log(req.body);
    if (!req.body.email || !req.body.password) {
      // res.json({ success: false, msg: 'Please pass username and password.' });
      signUpObj.notify =
        "Please pass username and password.";
      return res.render("defaultView", signUpObj);
    } else {
      // check username available
      let check = await User.findOne({
        email: req.body.email,
      })
        .lean()
        .exec();
      console.log(
        "check username available ",
        check
      );
      if (check) {
        signUpObj.notify =
          "email available. Try another email";
        return res.render("defaultView", signUpObj);
      }
  
      console.log(req.file);
      var newUser = new User({
        email: req.body.email,
        password: req.body.password,
        fullname: req.body.name,
        avatar: req.file.filename,
      });
      // save the user
      await newUser.save();
      return res.redirect("/");
    }
    // res.json({ success: true, msg: 'Successful created new user.' });
    
  }
);



// #SIGN IN
const signInObj = {
  layout: "login",
};
const homeObj = {
  layout: "manager",
};
router.get("/", async (req, res) => {
  isAdmin = false;

  res.render("defaultView", signInObj);
});
router.post("/", async function (req, res) {
  console.log(req.body);

  let user = await User.findOne({
    email: req.body.email,
  });

  console.log(user);

  if (!user) {
    // res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
    signInObj.notify =
      "Authentication failed. User not found.";
    return res.render("defaultView", signInObj);
  } else {
    // check if password matches
    // user.comparePassword(
    // req.body.password,
    // function (err, isMatch) {
    if (user.password == req.body.password) {
      // if user is found and password is right create a token
      // var token = jwt.sign(
      //   user.toJSON(),
      //   config.secret
      // );
      // return the information including token as JSON
      // res.json({ success: true, token: 'JWT ' + token });
      // req.session.authorization =
      //   "JWT " + token;
      // console.log(req.session);
      // homeObj.token = "JWT " + token;
      homeObj.user = user.toObject();
      // console.log("homeObj", homeObj);

      //res.header('Authorization', 'JWT ' + token);

      //res.header['Authorization'] = 'JWT ' + token;
      // userdefault = {
      //   id: '',
      //   email: '',
      //   fullname: '',
      // }
      // request.get(
      //   "http://localhost:8080/manager",
      //   {
      //     headers: {
      //       Authorization: "JWT " + token,
      //     },
      //   },
      //   function (error, response, body) {
          isAdmin = user.admin;
      //     info = user.toJSON();
      //     return res.send(body);
      //   }
      // );
      info = user.toJSON();
      return res.redirect("/manager");
    } else {
      // res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
      signInObj.notify =
        "Authentication failed. Wrong password.";
      return res.render("defaultView", signInObj);
    }
    // }
    // );
  }
});

// addproduct
router.post(
  "/addproduct",
  async function (req, res) {
    passport.authenticate("jwt", {
      session: false,
    });
    console.log(
      "headers: ",
      req.headers.authorization
    );
    var token = getToken(req.session);
    // if (token) {
    console.log(req.body);
    var newProduct = new ProductModel({
      name: req.body.name,
      price: req.body.price,
      desc: req.body.desc,
    });

    await newProduct.save();
    res.redirect("/manager");
    // } else {
    //   return res
    //     .status(403)
    //     .send({
    //       success: false,
    //       msg: "Unauthorized.",
    //     });
    // }
  }
);
router.get("/addproduct", function (req, res) {
  res.render("defaultView", {
    layout: "addproduct",
  });
});
//add user
router.get("/adduser", function (req, res) {
  res.render("defaultView", {
    layout: "adduser",
    admin: true,
    action: "/adduser",
  });
});
router.post(
  "/adduser",
  upload.single("myFile"),
  async function (req, res) {
    console.log(req.body);
    if (!req.body.email || !req.body.password) {
      // res.json({ success: false, msg: 'Please pass username and password.' });
      return res.render("defaultView", {layout: 'adduser', notify: 'Please pass username and password.'});
    } else {
      // check username available
      let check = await User.findOne({
        email: req.body.email,
      })
        .lean()
        .exec();
      console.log(
        "check username available ",
        check
      );
      if (check) {
        signUpObj.notify =
          "email available. Try another email";
        return res.render("defaultView", signUpObj);
      }
  
      console.log(req.file);
      var newUser = new User({
        email: req.body.email,
        password: req.body.password,
        fullname: req.body.name,
        avatar: req.file.filename,
      });
      // save the user
      await newUser.save();
      return res.redirect("/managerUser");
    }
    // res.json({ success: true, msg: 'Successful created new user.' });
    
  }
);
//editproduct
router.get(
  "/editproduct/:id",
  async (req, res) => {
    const product = await ProductModel.findOne({
      _id: req.params.id,
    }).lean();
    res.render("defaultView", {
      layout: "editproduct",
      pr: product,
    });
  }
);
router.post("/editproduct", async (req, res) => {
  //update
  const nv = await ProductModel.findOne({
    _id: req.body.id,
  });

  await ProductModel.updateOne(nv, req.body);

  res.redirect("/manager");
});
//edit user
router.get("/edituser/:id", async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
  }).lean();
  res.render("defaultView", {
    layout: "edituser",
    user: user,
  });
});
router.post("/edituser", upload.single("myFile"), async (req, res) => {
  //update user
  const nv = await User.findOne({
    _id: req.body.id,
  });

  await User.updateOne(nv, {
    email: req.body.email,
    password: req.body.password,
    fullname: req.body.name,
    avatar: req.file.filename,
  });

  info = {
    email: req.body.email,
    password: req.body.password,
    fullname: req.body.name,
    avatar: req.file.filename,
  }

  res.redirect("/managerUser");
});
//delete product
router.get(
  "/deleteproduct/:id",
  async (req, res) => {
    await ProductModel.deleteOne({
      _id: req.params.id,
    });
    res.redirect("/manager");
  }
);
//delete user
router.get(
  "/deleteuser/:id",
  async (req, res) => {
    await User.deleteOne({
      _id: req.params.id,
    });
    res.redirect("/managerUser");
  }
);

router.get("/info", async function (req, res) {
  console.log(info);
  res.render("defaultView", {
    layout: "info",
    user: info,
  });
});

router.get("/manager", async function (req, res) {
  // passport.authenticate("jwt", {
  //   session: false,
  // });
  console.log("Vao manager");
  // console.log("headers: ", req.headers);

  // var token = getToken(req.headers);
  // if (token) {
  let products = await ProductModel.find().lean();

  // res.json(products);
  homeObj.products = products;
  homeObj.price = products.price;
  homeObj.desc = products.desc;
  return res.render("defaultView", homeObj);
  // } else {
  //   return res
  //     .status(403)
  //     .send({
  //       success: false,
  //       msg: "Unauthorized.",
  //     });
  // }
});

router.get(
  "/managerUser",
  async function (req, res) {
    console.log("Vao managerUser");

    let users = await User.find().lean();
    // console.log(users);

    return res.render("defaultView", {
      layout: "managerUser",
      users: users,
      admin: isAdmin,
    });
    // } else {
    //   return res
    //     .status(403)
    //     .send({
    //       success: false,
    //       msg: "Unauthorized.",
    //     });
    // }
  }
);

getToken = (headers) => {
  console.log(headers && headers.authorization);
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
