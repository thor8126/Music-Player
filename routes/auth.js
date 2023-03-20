const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();
const passportLocal = require("../controller/passportLocal");
const googleStrategy = require("../controller/passportGoogle");




router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    const session = req.session;
    const user = session.passport.user;
    res.render("Home", { layout: "base1", title: "Home", user: user });
  } else {
    res.redirect("/login");
  }
});

router.get("/list", (req, res) => {
  res.render("MusicList", { layout: "base1", title: "List" });
});

router.get("/searchpage", (req, res) => {
  res.render("Search", { layout: "base1", title: "Search" });
});

router.get("/login", (req, res) => {
  res.render("Login", { layout: "base2", title: "Login" });
});

// handle user authentication and generate JWT tokens
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     User.findOne({ email: email }).then((user) => {
//       if (!user) {
//         return res.status(404).json({ emailnotfound: "Email not found" });
//       }
//       bcrypt.compare(password, user.password).then((isMatch) => {
//         if (isMatch) {
//           // User matched
//           // Create JWT Payload
//           const payload = {
//             id: user.id,
//             name: user.name,
//           };
//           // Sign token
//           jwt.sign(
//             payload,
//             process.env.SECRET_KEY,
//             { expiresIn: 3600 },
//             (err, token) => {
//               res.json({ success: true, token: "Bearer " + token });
//             }
//           );
//         } else {
//           return res
//             .status(400)
//             .json({ passwordincorrect: "Password incorrect" });
//         }
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send();
//   }
// });

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
});

router.get("/register", (req, res) => {
  res.render("Register", { layout: "base2", title: "Register" });
});

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, phone, password, confirmPassword } =
    req.body;
  if (password !== confirmPassword) {
    console.log("passwords do not match");
    return res.status(400).send("passwords do not match");
  }
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      console.log("user already exists");
      return res.status(400).send("user already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fistName: first_name,
      lastName: last_name,
      email: email,
      phone: phone,
      password: hashedPassword,
    });
    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.get("/login/federated/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/");
});

router.get('/logout', function(req, res){
  req.logout(function(err){
    if(err){
      console.log(err);
    }
    req.session.destroy(function(err){
      if(err){
        console.log(err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

module.exports = router;