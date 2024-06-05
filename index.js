require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: [
    "*",
    "http://localhost:3000",
    "http://localhost:3000",
    "https://dawndev.io.vn",
    "https://master-nu-pied.vercel.app/",
    "https://checklist.pmcweb.vn",
   "https://be-nodejs-project.vercel.app",
	  "https://pmc-rho.vercel.app"
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

require("./app/routes/ent_calv.route")(app);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
