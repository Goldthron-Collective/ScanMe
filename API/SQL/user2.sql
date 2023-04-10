
CREATE TABLE [scanmeDB].[dbo].[user] (
  id int NOT NULL IDENTITY(1,1) PRIMARY KEY,
  email varchar(60) NOT NULL,
  pswrd varchar(70) NOT NULL,
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  is_verified bit NOT NULL,
  account_type bit NOT NULL,
  receipt_count int NOT NULL,
);