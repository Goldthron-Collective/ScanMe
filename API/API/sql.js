var sql = require("mssql");

exports.execute = async (sqlQuery, config, encrypt = false) => {
  let pool = await new sql.connect(config);
  
  try {
    const request = pool.request();
    if (encrypt) {
      sqlQuery =
        "OPEN SYMMETRIC KEY SQLSymmetricKey DECRYPTION BY CERTIFICATE SelfSignedCertificate; " +
        sqlQuery +
        " CLOSE SYMMETRIC KEY SQLSymmetricKey;";
    }
    const result = await request.query(sqlQuery);
    pool.close();
    return result;
  } catch (err) {
    console.error("SQL Error", err);
  }
};



exports.sqlString = function (text, dateused = false) {
  if (text === undefined || text === null) {
    return "NULL";
  } else {
    var newText = replaceAll(text.toString(),"'", "''").trim().toString();

    if (dateused && newText != 0) {
      newText = new Date(newText)
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
    }

    newText = "'" + newText + "'";
    if (newText === "''") {
      return "NULL";
    } else {
      return newText;
    }
  }
};

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, "g"), replace);
}