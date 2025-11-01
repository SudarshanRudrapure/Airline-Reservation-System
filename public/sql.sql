create database airlines;
use airlines;
CREATE TABLE flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    airplane_code int unique,
    airplane_name varchar(255),
    departure VARCHAR(255),
    arrival VARCHAR(255),
    departure_date DATE,
    departure_time TIME,
    arrival_date DATE,
    arrival_time TIME,
    price float,
    total_seats int
);
select * from flights;
alter table flights drop column ticket_class;
INSERT INTO flights (airplane_code, airplane_name, departure, arrival, departure_date, departure_time, arrival_date, arrival_time, price)
VALUES 
(1001, 'Boeing 737', 'New York', 'Los Angeles', '2024-06-01', '08:00:00', '2024-06-01', '11:00:00', 350.00),
(1002, 'Airbus A320', 'Chicago', 'Miami', '2024-06-02', '09:00:00', '2024-06-02', '12:00:00', 300.00),
(1003, 'Boeing 747', 'Dallas', 'San Francisco', '2024-06-03', '07:30:00', '2024-06-03', '10:30:00', 400.00),
(1004, 'Boeing 767', 'Atlanta', 'Seattle', '2024-06-04', '06:00:00', '2024-06-04', '09:00:00', 450.00),
(1005, 'Airbus A380', 'Boston', 'Houston', '2024-06-05', '10:00:00', '2024-06-05', '13:00:00', 500.00);




CREATE TABLE passengers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flightId int not null,
    name VARCHAR(255) NOT NULL,
    dob date NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    phone_no VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    FOREIGN KEY (flightId) REFERENCES flights(id));


INSERT INTO flights(airplane_code, airplane_name, departure, arrival, departure_date, departure_time, arrival_date, arrival_time, price) values(1006, 'Boeing 535', 'New Jersey', 'Las Vegas', '2024-06-01', '08:00:00', '2024-06-01', '11:00:00', 450.00,4);
select*from passengers;
alter table passengers drop column age;
alter table passengers add column age int;
drop table passengers;

CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    food_included BOOLEAN,
    food_type VARCHAR(50),
    entertainment_included BOOLEAN,
    seat_class VARCHAR(50),
    num_passengers INT,
    total_price DECIMAL(10, 2),
    FOREIGN KEY (flight_id) REFERENCES flights(id)
);
select*from services;
select*from payments;

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT,
    passenger_id INT,
    payment_method VARCHAR(255),
    payment_details TEXT,
    transaction_status VARCHAR(50)
);
drop table payments;

CREATE TABLE ticketDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_name VARCHAR(255),
    dob DATE,
    gender VARCHAR(10),
    phone_no VARCHAR(20),
    email VARCHAR(255),
    flight_id INT,
    airplane_code VARCHAR(20),
    airplane_name VARCHAR(255),
    departure VARCHAR(255),
    arrival VARCHAR(255),
    departure_date DATE,
    departure_time TIME,
    arrival_date DATE,
    arrival_time TIME,
    total_price DECIMAL(10, 2)
);
select*from ticketDetails;
