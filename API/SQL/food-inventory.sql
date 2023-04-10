/****** Script for SelectTopNRows command from SSMS  ******/
CREATE TABLE [scanmeDB].[dbo].[food-inventory] (
  id int IDENTITY(1,1) PRIMARY KEY,
  item int NOT NULL,
  qty varchar(30) NOT NULL,
  date DATETIME NOT NULL,
  expirey_date DATETIME NOT NULL,
  location varchar(30) NOT NULL,
  calories float NOT NULL,
  energy int NOT NULL,
  carbohydrates int NOT NULL,
  fat int NOT NULL,
  protien float NOT NULL,
  sodium float NOT NULL,
  sugar float NOT NULL,
  

);
