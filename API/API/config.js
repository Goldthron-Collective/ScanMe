
exports.scanDB = { // THIS IS ELUCID TEST SERVER BUT RENAMED TO MAKE EASIER DEPLOYMENT
  user: "user1",
  password: "1234",
  server: "localhost\\SQLEXPRESS",
  port: 1433,
  database: "scanmeDB",
  options: {
    enableArithAbort: true,
    instanceName: "scanmeDB",
    //IntegratedSecurity: true,

    //cryptoCredentialsDetails: {
    // minVersion: "TLSv1",
    //},
    trustServerCertificate: true,
  },
  connectionTimeout: 30000,
  requestTimeout: 0,
};
