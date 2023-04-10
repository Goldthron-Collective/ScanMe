module.exports = function (app) {
    var FoodFinder = require("../controllers/foodFinder");
  
   
    app.route("/FoodFinder/login").get(FoodFinder.Login);
    app.route("/FoodFinder/signup").get(FoodFinder.SignUp);
    app.route("/FoodFinder/deleteAccount").get(FoodFinder.deleteAccount);
    app.route("/FoodFinder/updatePass").get(FoodFinder.updatePassword);

    app.route("/FoodFinder/add").post(FoodFinder.addInventory);
    app.route("/FoodFinder/remove").get(FoodFinder.removeInventory);

    app.route("/FoodFinder/getInventory").get(FoodFinder.getInventory);
  
   
  
    
  
  
  };
  