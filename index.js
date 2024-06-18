require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require('./app/config/db.config');

var corsOptions = {
  origin: [
    "*",
    "http://localhost:3006"
  ],

  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions))

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static("app/public"));

app.get("/", (req, res) => {
  res.json("PMC ASSETS!");
});

require("./app/routes/ent_donvi.route")(app);
require("./app/routes/ent_grouppolicy.route")(app);
require("./app/routes/ent_policy.route")(app);
require("./app/routes/ent_connguoi.route")(app);
require("./app/routes/ent_nhompb.route")(app);
require("./app/routes/ent_chinhanh.route")(app);
require("./app/routes/ent_nhomts.route")(app);
require("./app/routes/ent_nghiepvu.route")(app);
require("./app/routes/ent_taisan.route")(app);
require("./app/routes/ent_phongbanda.route")(app);
require("./app/routes/tb_taisanqrcode.route")(app);
require("./app/routes/ent_user.route")(app);

const PORT = process.env.PORT || 4444;

db.authenticate()
  .then(() => {
    console.log('Connected to the database.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
