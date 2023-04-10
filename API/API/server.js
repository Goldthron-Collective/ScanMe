var express = require("express"),
  app = express(),
  port = process.env.PORT || 8082,
  bodyParser = require("body-parser");

  var cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  return next();
});


var supplyChainStockCheck = require("./api/routes/ScanMeRoutes");


supplyChainStockCheck(app);

app.listen(port);

console.log("API server started on: " + port);
