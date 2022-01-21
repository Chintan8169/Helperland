CREATE DATABASE HELPERLAND

CREATE TABLE CustomerDetailsTable
(
	FirstName VARCHAR(50) NOT NULL,
	LastName VARCHAR(50) NOT NULL,
	Email VARCHAR(60) PRIMARY KEY,
	MobileNumber BIGINT NOT NULL,
	DateOfBirth DATE NULL,
	PreferredLanguage VARCHAR(20),
	Password VARCHAR(60)
)

CREATE TABLE ServiceProviderDetails
(
	FirstName VARCHAR(50) NOT NULL,
	LastName VARCHAR(50) NOT NULL,
	Email VARCHAR(60) PRIMARY KEY,
	MobileNumber BIGINT NOT NULL,
	Password VARCHAR(60),
	DateOfBirth DATE NULL,
	Nationality VARCHAR(30) NULL,
	Gender VARCHAR(10) NULL,
	Avatar VARCHAR(10) NULL,
	StreetName VARCHAR(30) NULL,
	HouseNumber INT NULL,
	PostalCode INT NULL,
	City VARCHAR(30) NULL

)

CREATE TABLE CustomerAddresses
(
	AddressID INT IDENTITY(1,1) PRIMARY KEY,
	CustomerEmail VARCHAR(60) FOREIGN KEY REFERENCES CustomerDetailsTable(Email),
	StreetName VARCHAR(30) NULL,
	HouseNumber INT NULL,
	PostalCode INT NULL,
	City VARCHAR(30) NULL,
	PhoneNumber BIGINT NULL
)

CREATE TABLE BlockList
(
	BlockerEmail VARCHAR(60),
	BlockingEmail VARCHAR(60)
)

CREATE TABLE FavouriteSP
(
	CustomerEmail VARCHAR(60) FOREIGN KEY REFERENCES CustomerDetailsTable(Email),
	SPEmail VARCHAR(60) FOREIGN KEY REFERENCES ServiceProviderDetails(Email)
)

CREATE TABLE ServiceRequestDetails
(
	ServiceId INT IDENTITY(8000,1) PRIMARY KEY,
	CustomerEmail VARCHAR(60),
	SPEmail VARCHAR(60),
	DateOfService DATE NULL,
	ServiceStartTime TIME NULL,
	ServiceDuration FLOAT NULL,
	PaymentAmount INT NULL,
	RefundAmount INT NULL,
	RefundReason VARCHAR(100) NULL,
	Status VARCHAR(20) NULL,
	Pets BIT NULL,
	ExtraServices VARCHAR(100) NULL,
	Distance FLOAT NULL,
	AddressID INT FOREIGN KEY REFERENCES CustomerAddresses(AddressID),
	OverallRating INT NULL,
	OnTimeRating INT NULL,
	FriendlyRating INT NULL,
	QualityOfServiceRating INT NULL,
	Feedback VARCHAR(100) NULL,
	CalcelledReason VARCHAR(100) NULL,
	Comment VARCHAR(100) NULL
)