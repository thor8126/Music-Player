
require("dotenv").config();
require("../config/passportGoogle");
require("../config/passportLocal");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const crypto = require('crypto');
const nodemailer = require('nodemailer');



module.exports.register = async (req, res) => {
  console.log(req.body);
  const { first_name, last_name, email, phone, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    console.log("passwords do not match");
    return res.status(400).render("Register", {
      layout: "base2", title: "Register", message: {
        type: "warning",
        msg: "Passwords do not match",
      }
    });
  }
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      console.log("user already exists");
      return res.render("Register", {
        layout: "base2", title: "Register", message: {
          type: "danger",
          msg: "User already exists",
        }
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName: first_name,
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

}

module.exports.home = async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findById(req.session.passport.user);
    return res.render("Home", { layout: "base1", title: "Home", user: user });
  }
  else {
    res.render("Home", { layout: "base1", title: "Home" });
    // res.redirect("/login");
  }

}

module.exports.getLogin = async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findById(req.session.passport.user);
    return res.render("Home", { layout: "base1", title: "Home", user: user });
  }
  res.render("Login", { layout: "base2", title: "Login" });
}

module.exports.getRegister = async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findById(req.session.passport.user);
    return res.render("Home", { layout: "base1", title: "Home", user: user });
  }
  res.render("Register", { layout: "base2", title: "Register" });
}

module.exports.getList = async (req, res) => {
  const user = await User.findById(req.session.passport.user);
  res.render("MusicList", { layout: "base1", title: "List", user: user });
}

module.exports.getSearchPage = async (req, res) => {
  const user = await User.findById(req.session.passport.user);
  res.render("Search", { layout: "base1", title: "Search", user: user });
}

module.exports.logout = function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
}

module.exports.getmyLibrary = async (req, res) => {
  const user = await User.findById(req.session.passport.user);
  res.render("MyLibrary", { layout: "base1", title: "My Library", user: user });
}

module.exports.sendEmail = async (req, res) => {
  const email = req.body.email;
  console.log(email);
  // send an email if the email exists in the database with a link to reset password page with a token
  try {
    // check if user with provided email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).render('ForgotPassword', { layout: "base2", title: "Reset",message:{
        type:'warning',
        msg:'User does not exist'
      }});
    }
    // check if user has a Google ID
    if (user.googleId) {
      return res.status(400).render('ForgotPassword', { layout: "base2", title: "Reset",message:{
        type:'warning',
        msg:'This email address is associated with a Google account. Please use the "Sign in with Google" button to log in.'
      }});
    }
    
    // generate a password reset token
    const token = crypto.randomBytes(20).toString('hex');

    // save the token to the user document and set expiry time to 1 hour from now
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // create a transport object for nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // create the email message
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password reset request',
      text: `Hi ${user.username}, \n\nYou have requested to reset your password. Please click on the following link or paste it into your browser to reset your password:\n\n` +
        `${req.protocol}://${req.headers.host}/reset-password/${token}\n\n` +
        `The link will expire in 1 hour.\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    // send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).render('ForgotPassword', {
          layout: "base2", title: "Forgot Password", message: {
            type: "danger",
            msg: "Failed to send reset password email",
          }
        });

      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).render('Login', {
          layout: "base2", title: "Forgot Password", message: {
            type: "success",
            msg: "Email sent successfully",
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).render('ForgotPassword', {
      layout: "base2", title: "Forgot Password", message: {
        type: "danger",
        msg: "Failed to send reset password email",
      }
    });
  }
};

module.exports.resetPassword = async (req, res) => {
  const token = req.params.token;
  console.log(token);
  // check if the token is valid
  try {
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired');
    }
    
    res.render('ResetPassword', { layout: "base2", title: "Reset Password", token: token });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal server error');
  }
};

module.exports.updatePassword = async (req, res) => {
  const token = req.params.token;
  const password = req.body.password;
  console.log(token);

  // check if the token is valid
  try {
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).render('ResetPassword', {
        layout: "base2", title: "Reset Password", token: token, message: {
          type: "danger",
          msg: "Link invalid or has expired",
        }
      });
    }

    // hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // create a transport object for nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // create the email message
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Your password has been changed',
      text: `Hi ${user.username}, \n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
    };

    // send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).send('Failed to send confirmation email');
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).render('Success', {
          layout: "base2", title: "Reset Password", message: {
            type: "success",
            msg: "Password reset successfully",
          }
        });
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal server error');
  }
};