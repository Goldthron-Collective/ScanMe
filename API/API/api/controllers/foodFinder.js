var sql = require("../../sql");
var config = require("../../config");
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);


exports.Login = async function (req, res, next) {

    req.query.email = req.query.email.toLowerCase();
  
    var passCheck = await sql.execute(
      `SELECT is_verified,pswrd,id FROM [scanmeDB].[dbo].[user] 
      WHERE email = ${sql.sqlString(req.query.email)}`,
      config.scanDB
    );
  
    if(passCheck.recordset.length != 1)
    {
    
      res.status(403).send(("403").toString());
      return next();
    }
  
  
    var passCompare = await bcrypt.compare(req.query.password, passCheck.recordset[0].pswrd);
  
  
    if(!passCompare)
    {
    
      res.status(404).send(("404").toString());
      return next();
    }
    
    if(passCheck.recordset[0].is_verified == false)
    {
      //send email to user which makes the is_verifited 1
      res.status(402).send(("402").toString());
      return next();
    }
  
    delete passCheck.recordset[0].pswrd;
  
  
  
    res.status(200).send(passCheck.recordset);
    return next();
  }
  
  exports.updatePassword = async function (req, res, next) {
  
    var passCheck = await sql.execute(
      `SELECT pswrd FROM [scanmeDB].[dbo].[user] 
      WHERE id = ${sql.sqlString(req.query.id)}`,
      config.scanDB
    );
  
    var passCompare = await bcrypt.compare(req.query.password, passCheck.recordset[0].pswrd);
    
  
    if(!passCompare)
    {
      
      res.status(404).send(("404").toString());
      return next();
    }
    delete passCheck.recordset[0].pswrd;
  
    req.query.newpass = bcrypt.hash(req.query.password, salt);
  
    await sql.execute(
      `UPDATE [scanmeDB].[dbo].[user]
      SET pswrd = ${sql.sqlString(req.query.newpass)}
      WHERE id= ${sql.sqlString(req.query.id)}`,
      config.scanDB
    );
  
    res.sendStatus(200).end();
    return next();
  
  }
  
  
  exports.SignUp = async function (req, res, next) {
  
    req.query.email = req.query.email.toLowerCase();
  
    var checkExists = await sql.execute(
      `SELECT id FROM [scanmeDB].[dbo].[user] 
      WHERE email = ${sql.sqlString(req.query.email)}`,
      config.scanDB
    );
  
    if(checkExists.recordset.length >= 1)
    {
      
      res.sendStatus(400).end();;
      return next();
    }
  
  
    let newPass = req.query.password.toString();
  
    newPass = await bcrypt.hash(newPass, parseInt(salt));
    
    await sql.execute(
      `INSERT INTO [scanmeDB].[dbo].[user] (email,pswrd,first_name,last_name,is_verified) 
      VALUES (
        ${sql.sqlString(req.query.email)},
        ${sql.sqlString(newPass)},
        ${sql.sqlString(req.query.first_name)},
        ${sql.sqlString(req.query.last_name)},
        0)`,
        config.scanDB
      );
    
    delete newPass;
    delete req.query.password;
    
    res.sendStatus(200).end();
    return next();
  };

  exports.deleteAccount = async function (req, res, next) {


    try{
      await sql.execute(
        `DELETE FROM [scanmeDB].[dbo].[user] WHERE id = ${sql.sqlString(req.query.id)}`,
        config.scanDB
      );
  
      res.status(200).end();
      return next();
  
    }
    catch(e)
    {
      res.status(404).end();
      return next();
    }
  
  }

  exports.addInventory = async function (req, res, next) {

    //add item to database

    //read all food ingridents from data base

    // call recipe API

    // Add all recipies to API

  }
  exports.removeInventory = async function (req, res, next) {

    //removes item from inventory with specified stock / all

    //then does the same as above with API calls etc...

  }
  exports.getInventory = async function (req, res, next) {

    //get all food ingridents , expiry date , qty , location , cost
    
  }