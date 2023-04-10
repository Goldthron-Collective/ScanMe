/****** Script for SelectTopNRows command from SSMS  ******/
CREATE TABLE [scanmeDB].[dbo].[food-recipe] (
  id int IDENTITY(1,1) PRIMARY KEY,
  meal_name int NOT NULL,
  ing_req NVARCHAR(max) NOT NULL,
  link varchar(60) NOT NULL,
  image varchar(60) NOT NULL,
  summary varchar(max) ,
  steps NVARCHAR(max),

  
);
