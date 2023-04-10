module.exports = function (app) {
  var ScanMe = require("../controllers/ScanMe");

 
  app.route("/ScanMe/login").get(ScanMe.Login);
  app.route("/ScanMe/signup").get(ScanMe.SignUp);
  
  app.route("/ScanMe/addReceipt").post(ScanMe.addReceipt);
  app.route("/ScanMe/getAllReceipts").get(ScanMe.getAllReceipts);
  app.route("/ScanMe/getByRecId").get(ScanMe.getById);
  app.route("/ScanMe/updatePass").get(ScanMe.updatePassword);
  app.route("/ScanMe/deleteAllRecipts").get(ScanMe.deleteRecipt);
  app.route("/ScanMe/deleteAccount").get(ScanMe.deleteAccount);
  app.route("/ScanMe/updRec").get(ScanMe.updateRecByID);
  app.route("/ScanMe/recimage").get( ScanMe.getRecImage);
  app.route("/ScanMe/delRec").post(ScanMe.deleteRecipt);
  app.route("/ScanMe/incrementAccount").post(ScanMe.incrementAccount);
  


};
