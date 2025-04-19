SET NOCOUNT ON;
SET ANSI_NULLS ON


IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'OrderManagerDb')
BEGIN
    print 'Creating OrderManagerDb database...'
    CREATE DATABASE [OrderManagerDb];
END


USE OrderManagerDb;


IF 1=1
BEGIN
    Print 'Dropping Tables...'
    -- Reset by dropping the tables if they exist
    IF EXISTS (SELECT * FROM sysobjects WHERE name='Orders' and xtype='U')
    BEGIN
        print 'Dropping Order Table...'
        DROP TABLE Orders;
    END

    IF EXISTS (SELECT * FROM sysobjects WHERE name='Employees' and xtype='U')
    BEGIN
        print 'Dropping Employee Table...'
        DROP TABLE Employees;
    END
    
    IF EXISTS (SELECT * FROM sysobjects WHERE name='Products' and xtype='U')
    BEGIN
        print 'Dropping Product Table...'
        DROP TABLE Products;
    END

    -- Drop the Cusotmers table and its history table if they exist
    IF EXISTS (SELECT * FROM sysobjects WHERE name='Customers' and xtype='U')
    BEGIN
        print 'Dropping Customer Table...'
        ALTER TABLE Customers SET (SYSTEM_VERSIONING = OFF);
        DROP TABLE Customers;
        DROP TABLE CustomersHistory
    END

END

---- Create the Customers table with system versioning so we can track changes over time
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Customers' and xtype='U')
BEGIN
    print 'Creating Customer Table...'
    CREATE TABLE Customers
    (
        CustomerId INT PRIMARY KEY IDENTITY(1000,1), -- Starting from 1000 to keep customer Ids longer than 1 digit
        FirstName NVARCHAR(50) NOT NULL,
        MiddleInitial NVARCHAR(3) NOT NULL,
        LastName NVARCHAR(50) NOT NULL,

        -- Required for system versioning
        ValidFrom DATETIME2 GENERATED ALWAYS AS ROW START NOT NULL,
        ValidTo DATETIME2 GENERATED ALWAYS AS ROW END NOT NULL,
        PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
    )
    WITH
    (
        SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.CustomersHistory)
    );

    -- Customers indexes
    CREATE UNIQUE INDEX IX_Customers_CustomerId ON Customers (CustomerId);
    CREATE INDEX IX_Customers_LastName ON Customers (LastName);

END


-- create the Employees table (Employees are not versioned in this demo)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Employees' and xtype='U')
BEGIN
    print 'Creating Employees Table'
    CREATE TABLE Employees (
        EmployeeId INT IDENTITY(1000,1) PRIMARY KEY,
        FirstName NVARCHAR(50) NOT NULL,
        MiddleInitial NVARCHAR(3) NOT NULL,
        LastName NVARCHAR(50) NOT NULL,
    )

       -- Employees indexes
    CREATE UNIQUE INDEX IX_Employees_EmployeeId ON Employees (EmployeeId);
    CREATE INDEX IX_Employees_LastName ON Employees (LastName);

END


-- create the Products table (products are not versioned in this demo)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Products' and xtype='U')
BEGIN
    print 'Creating Products Table'
    CREATE TABLE Products (
        ProductId INT IDENTITY(1000,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Price DECIMAL(18, 2) NOT NULL
    )       

    -- Products indexes
    CREATE UNIQUE INDEX IX_Products_ProductId ON Products (ProductId);
    CREATE INDEX IX_Products_Name ON Products (Name);
    CREATE INDEX IX_Products_Price ON Products (Price);

END

--Orders Table
if NOT EXISTS (SELECT * FROM sysobjects WHERE name='Orders' and xtype='U')
BEGIN
    print 'Creating Orders Table'
    CREATE TABLE Orders (
        OrderId INT IDENTITY(1000,1) PRIMARY KEY,
        SalesPersonId INT NOT NULL, -- EmployeeId would be nicer, but sticking to the spec
        CustomerId INT NOT NULL,
        ProductId INT NOT NULL,        
        Quantity INT NOT NULL,
        CONSTRAINT FK_Orders_Customers 
            FOREIGN KEY (CustomerId) 
            REFERENCES Customers(CustomerId) 
            ON DELETE CASCADE,

        CONSTRAINT FK_Orders_Employees 
            FOREIGN KEY (SalesPersonId) 
            REFERENCES Employees(EmployeeId),

        CONSTRAINT FK_Orders_Products 
            FOREIGN KEY (ProductId) 
            REFERENCES Products(ProductId)
    )

    -- Orders indexes
    CREATE UNIQUE INDEX IX_Orders_ORderId ON Orders (OrderId);
    CREATE INDEX IX_Orders_CustomerId ON Orders (CustomerId);
    CREATE INDEX IX_Orders_SalesPersonId ON Orders (SalesPersonId);
    CREATE INDEX IX_Orders_ProductId ON Orders (ProductId);    

END


--Option to seed the tables
IF 1=1
BEGIN
    print 'Seeding the tables...'
    

    INSERT INTO Employees (FirstName, MiddleInitial, LastName) VALUES 
        ('Alice', 'M', 'Morgan'),
        ('Bob', 'T', 'Thompson'),
        ('Charlie', 'J', 'Nguyen'),
        ('Diana', 'K', 'Khan'),
        ('Ethan', 'P', 'Wong'),
        ('Fiona', 'L', 'Patel'),
        ('George', 'A', 'Carter'),
        ('Hannah', 'R', 'White'),
        ('Isaac', 'S', 'Brooks'),
        ('Julia', 'V', 'Martinez');


    INSERT INTO Customers (FirstName, MiddleInitial, LastName) VALUES 
        ('John', 'A', 'Smith'),
        ('Emily', 'B', 'Johnson'),
        ('Michael', 'C', 'Williams'),
        ('Sarah', 'D', 'Brown'),
        ('David', 'E', 'Jones'),
        ('Olivia', 'F', 'Garcia'),
        ('Daniel', 'G', 'Miller'),
        ('Sophia', 'H', 'Davis'),
        ('James', 'I', 'Rodriguez'),
        ('Isabella', 'J', 'Martinez');


    INSERT INTO Products (Name, Price) VALUES 
        ('ProFix Cordless Drill 18V', 89.99),
        ('SureGrip Adjustable Wrench Set', 24.50),
        ('MaxPower Lithium Battery Pack', 49.99),
        ('UltraBright LED Work Light', 19.99),
        ('QuickSeal Waterproof Tape', 7.99),
        ('TurboFlow Garden Hose 50ft', 29.95),
        ('AllWeather Outdoor Extension Cord', 14.99),
        ('PrecisionPlus Screwdriver Set', 12.49),
        ('FlexiMount Wall Bracket', 34.75),
        ('HeavyDuty Storage Bin 80L', 16.99);
            

    --Seed the Orders table with random order data
    DECLARE @i INT = 1;

    WHILE @i <= 50
    BEGIN
        INSERT INTO Orders (CustomerId, SalesPersonId, ProductId, Quantity)
        VALUES (
            FLOOR(RAND() * 10) + 1000,
            FLOOR(RAND() * 10) + 1000,
            FLOOR(RAND() * 10) + 1000,
            FLOOR(RAND() * 10) + 5 
        );
        SET @i = @i + 1;
    END
    -- Example of a customer with zero orders
    DELETE from Orders where CustomerId = 1002 


END







