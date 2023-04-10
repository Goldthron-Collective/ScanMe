/****** Script for SelectTopNRows command from SSMS  ******/
CREATE TABLE [scanmeDB].[dbo].[receipt] (
  id int NOT NULL,
  recipt_id int IDENTITY(1,1) PRIMARY KEY,
  title varchar(30) NOT NULL,
  images VARCHAR(MAX) NOT NULL,
  dateofupload DATETIME NOT NULL,
  dateatime varchar(40) NOT NULL,
  total float NOT NULL,
  currency char NOT NULL,
  changes float NOT NULL,
  items NVARCHAR(max) NOT NULL ,
);
