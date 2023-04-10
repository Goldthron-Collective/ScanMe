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
    `INSERT INTO [scanmeDB].[dbo].[user] (email,pswrd,first_name,last_name,is_verified,account_type,receipt_count) 
    VALUES (
      ${sql.sqlString(req.query.email)},
      ${sql.sqlString(newPass)},
      ${sql.sqlString(req.query.first_name)},
      ${sql.sqlString(req.query.last_name)},
      0,0,0)`,
      config.scanDB
    );
  
  delete newPass;
  delete req.query.password;

  //SEND VERIFICAITON LINK TO EMAIL!
  
  res.sendStatus(200).end();
  return next();
};


exports.addReceipt = async function (req, res, next) {

 console.log("image in KB: "+req.body.image.length / 1000);

  try{

    await sql.execute(
      `INSERT INTO [scanmeDB].[dbo].[receipt] (id,dateatime,total,currency,changes,items,images,dateofupload,title) 
      VALUES (
        ${sql.sqlString(req.query.id)},
        ${sql.sqlString(req.query.date)},
        ${sql.sqlString(req.query.total)},
        ${sql.sqlString(req.query.currency)},
        ${sql.sqlString(req.query.change)},
        ${sql.sqlString(req.query.items)},
        ${sql.sqlString(req.body.image)},
        CURRENT_TIMESTAMP,
        ${sql.sqlString(req.query.title)}
        )`,
        config.scanDB
      );

      res.sendStatus(200).end();
      return next();
      

  }
  catch(e)
  {
    res.sendStatus(400).end();
    return next();
  }

};
exports.getAllReceipts = async function (req, res, next) {

  var data = await sql.execute(
    `  SELECT title , recipt_id , dateofupload , total , currency FROM [scanmeDB].[dbo].[receipt]
    WHERE id = ${sql.sqlString(req.query.id)}`,
      config.scanDB
    );
 
  res.status(200).send(data.recordset);
  return next();
};
exports.getById = async function (req, res, next) {


  var data = await sql.execute(
    `SELECT title,dateofupload,dateatime,total,currency,changes,items FROM [scanmeDB].[dbo].[receipt]
    WHERE id = ${sql.sqlString(req.query.id)}
    AND recipt_id = ${sql.sqlString(req.query.recid)}`,
      config.scanDB
    );


  res.status(200).send(data.recordset);
  return next();
}
exports.getRecImage = async function (req, res, next) {
  var data = await sql.execute(
    `SELECT images FROM [scanmeDB].[dbo].[receipt]
    WHERE id = ${sql.sqlString(req.query.id)}
    AND recipt_id = ${sql.sqlString(req.query.recid)}`,
      config.scanDB
    );


  res.status(200).send(data.recordset);
  return next();
}
exports.updateRecByID = async function (req, res, next) {

  try{
    await sql.execute(
      `UPDATE [scanmeDB].[dbo].[receipt] 
      SET title=${sql.sqlString(req.query.title)},
      dateofupload=${sql.sqlString(req.query.dateofupload)},
      dateatime=${sql.sqlString(req.query.datetime)},
      total=${sql.sqlString(req.query.total)},
      currency=${sql.sqlString(req.query.currency)},
      changes=${sql.sqlString(req.query.change)},
      items=${sql.sqlString(req.query.items)}
      WHERE id=${sql.sqlString(req.query.id)} AND 
      recipt_id=${sql.sqlString(req.query.recid)}`,
      config.scanDB
      );
  
  }
  catch(e)
  {
    res.status(404).send();
    return next();
  }
  
  res.status(200).send();
  return next();
}
exports.incrementAccount = async function (req,res,next)
{
  try{
    var response = await sql.execute(
      `UPDATE [scanmeDB].[dbo].[user] SET receipt_count = ((SELECT receipt_count WHERE id =  ${sql.sqlString(req.query.id)})+1) WHERE id =  ${sql.sqlString(req.query.id)}  
      SELECT receipt_count , account_type FROM [scanmeDB].[dbo].[user] WHERE id = ${sql.sqlString(req.query.id)}`,
      config.scanDB
    );


    if(response.recordset[0].receipt_count >= 5 & response.recordset[0].account_type == 0)
    {
      //stops free tier users from exceeding 5 uses
      res.status(400).end();
      return next();
    }

    res.status(200).end();
    return next();
  }
  catch(e)
  {
    res.status(404).end();
    return next();
  }
}
exports.deleteRecipt = async function (req, res, next) {


  try{
    await sql.execute(
      `DELETE FROM [scanmeDB].[dbo].[receipt] WHERE id = ${sql.sqlString(req.query.id)}`,
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
exports.deleteRecipt = async function (req, res, next) {

  try{
    await sql.execute(
      `DELETE FROM [scanmeDB].[dbo].[receipt] WHERE id = ${sql.sqlString(req.query.id)} AND 
      recipt_id = ${sql.sqlString(req.query.recid)}`,
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