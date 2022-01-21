/* DATABASE CREATE*/
CREATE DATABASE HELPERLAND_DARSHIT
USE HELPERLAND_DARSHIT

/* Customer Table */

CREATE TABLE tblCustomer
(
		ID INT IDENTITY (1,1) NOT NULL PRIMARY KEY, 
		Firstname NVARCHAR(20) NOT NULL,
		Lastname NVARCHAR(20) NOT NULL,
		Email_id NVARCHAR(30) NOT NULL UNIQUE,
		Phone_no NVARCHAR(15) NOT NULL UNIQUE,
		Birthdate DATE,
		Language NVARCHAR(15),
		Password NVARCHAR(30) NOT NULL
)

/* Service Provider Table */

CREATE TABLE tblService_provider
(
		ID INT IDENTITY (1,1) NOT NULL PRIMARY KEY , 
		Firstname NVARCHAR(20) NOT NULL ,
		Lastname NVARCHAR(20) NOT NULL ,
		Email_id NVARCHAR(30) NOT NULL UNIQUE,
		Phone_no NVARCHAR(15) NOT NULL UNIQUE,
		Birthdate DATE ,
		Nationality NVARCHAR(15),
		Gender CHAR(1) NOT NULL,
		Avtar VARBINARY(MAX),
		House_no INT,
		Address NVARCHAR(50),
		Postal_code NVARCHAR(10),
		City NVARCHAR(50),
		Status BIT NOT NULL DEFAULT '0',
		Password NVARCHAR(30) NOT NULL,
		Radius INT 
)

/* Admin Table */

CREATE TABLE tblAdmin
(
		ID INT IDENTITY (1,1) NOT NULL PRIMARY KEY , 
		Firstname NVARCHAR(20) NOT NULL,
		Lastname NVARCHAR(20) NOT NULL,
		Email_id NVARCHAR(30) NOT NULL UNIQUE,
		Password NVARCHAR(30) NOT NULL
)

/* Customer address Table */

CREATE TABLE tblCustomer_address
(
		ID INT IDENTITY (1,1) NOT NULL PRIMARY KEY , 
		Customer_ID INT NOT NULL FOREIGN KEY REFERENCES tblCustomer(ID),
		House_no INT,
		Address NVARCHAR(50),
		Postal_code NVARCHAR(10),
		City NVARCHAR(50),
		Phone_no NVARCHAR(15) NOT NULL,
)

/* Status Table */

CREATE TABLE tblStatus
(
		ID INT NOT NULL  PRIMARY KEY, 
		Name VARCHAR(10)
)

/* Service Table */

CREATE TABLE tblService
(
		ID INT IDENTITY (1,1) NOT NULL PRIMARY KEY , 
		Customer_ID INT NOT NULL FOREIGN KEY REFERENCES tblCustomer(ID),
		Service_provicer_ID INT  FOREIGN KEY REFERENCES tblService_provider(ID),
		Date DATE NOT NULL ,
		Start_time TIME NOT NULL,
		Duration TIME NOT NULL,
		Extra_service NVARCHAR(50),
		Comment NVARCHAR(50) ,
		Pet BIT NOT NULL,
		Total_price FLOAT NOT NULL,
		Address_id INT NOT NULL FOREIGN KEY REFERENCES tblCustomer_address(ID),
		Status INT NOT NULL FOREIGN KEY REFERENCES tblStatus(ID),
)

/* Service Provider Rating Table */

CREATE TABLE tblSp_rating
(
		ID INT IDENTITY (1,1) NOT NULL PRIMARY KEY , 
		Service_id INT NOT NULL FOREIGN KEY REFERENCES tblService(ID),
		Customer_ID INT NOT NULL FOREIGN KEY REFERENCES tblCustomer(ID),
		Service_provicer_ID INT NOT NULL FOREIGN KEY REFERENCES tblService_provider(ID),
		On_time_arrival FLOAT ,
		Friendly FLOAT ,
		Quality_of_service FLOAT ,
		Rating FLOAT NOT NULL,
		Comment NVARCHAR(50),
)

/* Favourite table */

CREATE TABLE tblFavourite
(
		ID INT IDENTITY (1,1) NOT NULL PRIMARY KEY , 
		Customer_ID INT NOT NULL FOREIGN KEY REFERENCES tblCustomer(ID),
		Service_provicer_ID INT NOT NULL FOREIGN KEY REFERENCES tblService_provider(ID)
)

/* Block table */

CREATE TABLE tblBlock
(
		ID INT IDENTITY (1,1) NOT NULL PRIMARY KEY , 
		Customer_ID INT NOT NULL FOREIGN KEY REFERENCES tblCustomer(ID),
		Service_provicer_ID INT NOT NULL FOREIGN KEY REFERENCES tblService_provider(ID)
)
