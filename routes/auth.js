require("dotenv").config();
require("../config/passportGoogle");
require("../config/passportLocal");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const isAuthenticated = require("../config/isAuthenticated");
const {updatePassword, register ,home ,getLogin ,getRegister, getList, getSearchPage, logout, getmyLibrary, sendEmail, resetPassword} = require("../controllers/userController");

router.get("/", home );

router.get("/login", getLogin);

router.get("/register", getRegister);

//auth with google(open google login page)
router.get("/login/federated/google", passport.authenticate("google", { scope: ["profile", "email"] }));

//callback route for google to redirect to
router.get("/auth/google/callback", passport.authenticate("google", { 
  failureRedirect: "/login",
  successRedirect: "/",
  failureFlash: { type:'error',msg:'Password or Email error'}
 }), (req, res) => {
  res.redirect("/");
});

router.get("/list", isAuthenticated, getList);

router.get("/searchpage", isAuthenticated , getSearchPage);

router.get("/myLibrary", isAuthenticated, getmyLibrary);

router.post('/login', passport.authenticate('local', { 
  failureRedirect: '/login',
  successRedirect: '/',
  failureFlash: { type: 'warning', msg: 'Invalid email or password' }
 }), (req, res) => {
  res.redirect('/');
});

router.post("/register", register);

router.get('/forgotpassword', (req, res) => {
  res.render('ForgotPassword', { title: 'Forgot Password' ,layout: 'base2'});
});

router.post('/forgotpassword', sendEmail);

router.get('/reset-password/:token', resetPassword);

router.post('/reset-password/:token', updatePassword);

router.get('/logout', logout);

module.exports = router;