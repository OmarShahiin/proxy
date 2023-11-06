const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const FormData = require("form-data");
const path = require("path");
const https = require("https");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
//dev

//  const imageUrl = "http://127.0.0.1:8000"
// const url = "http://127.0.0.1:8000/"
// const hostURL = "https://localhost:5000"

//production
const imageUrl = "http://167.172.53.19:8000";
const url = "http://167.172.53.19:8000/";
const hostURL = "https://167.172.53.19:5000";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// const upload = multer({ dest: 'uploads/' }); // specify the destination folder to save files

// in latest body-parser use like below.
const appMid = express();
appMid.use(express.json());
appMid.use(express.urlencoded({ extended: true }));

appMid.use(cors());
// appMid.use(express.urlencoded({extended:true}));

appMid.all("/proxy/*", async (req, res) => {
  console.log("all");
  // console.log('req', req)
  // console.log(req.files);
  const url = req.originalUrl.replace("/proxy/", "");
  console.log("url", url);

  const method = req.method.toLowerCase();
  console.log("method", method);
  const headers = req.headers;
  console.log("headers", headers);
  const data = req.body;
  console.log("data", data);

  try {
    const response = await axios({
      method,
      url,
      headers,
      data,
    });

    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

appMid.listen(3050, () => {
  console.log("CORS proxy listening on port 3000");
});

// const { createProxyMiddleware } = require('http-proxy-middleware');
app.use(express.static("public"));
// serve up production assets
app.use(express.static("frontend/build"));
// let the react app to handle any unknown routes
// serve up the index.html if express does'nt recognize the route
app.get("*", (req, res) => {
  console.log("req", req);
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

// app.use('/', createProxyMiddleware({
//     target: 'http://167.172.53.19:8000',
//     changeOrigin: true,
//   }));

const httpsOptions = {
  key: fs.readFileSync("ssl/key.pem"),
  cert: fs.readFileSync("ssl/cert.pem"),
};
console.log("__dirname", __dirname);
// if not in production use the port 5000
const PORT = process.env.PORT || 5000;
console.log("server started on port:", PORT);

// https.createServer(httpsOptions,appMid).listen(3000,()=>{
//     console.log('serving port ', 3000)
// })

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log("serving port ", PORT);
});
