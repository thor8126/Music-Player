const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const hbs = require("hbs");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./controller/db");
const passport = require("passport");
const logger = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passportLocal = require("./controller/passportLocal");
const router = express.Router();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "base1",
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use(passport.session());


app.use('/', require('./routes/auth'));
app.use('/', require('./routes/music'));



app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// app.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
//   // handle request for dashboard page
// });
