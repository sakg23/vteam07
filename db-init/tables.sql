CREATE DATABASE IF NOT EXISTS elsparkcyklar;

USE elsparkcyklar;

DROP PROCEDURE IF EXISTS get_available_bikes;
DROP PROCEDURE IF EXISTS start_ride;
DROP PROCEDURE IF EXISTS end_ride;
DROP PROCEDURE IF EXISTS topup_balance;
DROP PROCEDURE IF EXISTS pay_for_ride;
DROP PROCEDURE IF EXISTS insert_city;
DROP PROCEDURE IF EXISTS insert_charging_station;
DROP PROCEDURE IF EXISTS insert_parking_zone;
DROP PROCEDURE IF EXISTS insert_scooter;
DROP PROCEDURE IF EXISTS insert_payment;
DROP PROCEDURE IF EXISTS insert_ride;
DROP PROCEDURE IF EXISTS insert_user;


DROP TABLE IF EXISTS app_versions;
DROP TABLE IF EXISTS maintenance;
DROP TABLE IF EXISTS bike_logs;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS rides;
DROP TABLE IF EXISTS free_parking;
DROP TABLE IF EXISTS bikes;
DROP TABLE IF EXISTS parking_zones;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    name VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    balance DECIMAL(10,2) DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(100)
);

CREATE TABLE stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NULL,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    capacity INT DEFAULT 10,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL
);


CREATE TABLE parking_zones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NULL,
    name VARCHAR(100),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    radius INT DEFAULT 50,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL
);

CREATE TABLE bikes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    city_id INT NULL,
    status ENUM('available','in_use','maintenance','charging','out_of_order') DEFAULT 'available',
    battery_level INT DEFAULT 100,
    current_latitude DECIMAL(9,6),
    current_longitude DECIMAL(9,6),
    last_station_id INT,
    last_zone_id INT,
    is_free_parking BOOLEAN DEFAULT FALSE,
    last_ride_id INT,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL
);

CREATE TABLE free_parking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bike_id INT,
    user_id INT,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)  ON DELETE SET NULL
);

CREATE TABLE rides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bike_id INT,
    user_id INT,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    start_latitude DECIMAL(9,6) NOT NULL,
    start_longitude DECIMAL(9,6) NOT NULL,
    end_latitude DECIMAL(9,6),
    end_longitude DECIMAL(9,6),
    start_station_id INT,
    end_station_id INT,
    start_zone_id INT,
    end_zone_id INT,
    distance_meters INT,
    cost DECIMAL(10,2),
    status ENUM('active','completed','cancelled') DEFAULT 'active',
    FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE SET NULL, 
    FOREIGN KEY (user_id) REFERENCES users(id)  ON DELETE SET NULL,
    FOREIGN KEY (start_station_id) REFERENCES stations(id) ON DELETE SET NULL,
    FOREIGN KEY (end_station_id) REFERENCES stations(id) ON DELETE SET NULL,
    FOREIGN KEY (start_zone_id) REFERENCES parking_zones(id) ON DELETE SET NULL,
    FOREIGN KEY (end_zone_id) REFERENCES parking_zones(id)ON DELETE SET NULL
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    ride_id INT,
    amount DECIMAL(10,2) NOT NULL,
    type ENUM('topup','monthly','ride','refund') NOT NULL,
    status ENUM('pending','completed','failed') DEFAULT 'pending',
    payment_provider VARCHAR(50),
    payment_reference VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE SET NULL
);

CREATE TABLE bike_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bike_id INT,
    event_type ENUM('move','stop','lock','unlock','maintenance','battery_low','charging','manual_override'),
    timestamp DATETIME NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    details TEXT,
    user_id INT,
    ride_id INT,
    FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE SET NULL
);

CREATE TABLE maintenance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bike_id INT,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    type ENUM('battery','mechanical','software','other'),
    description TEXT,
    status ENUM('open','closed') DEFAULT 'open',
    performed_by INT,
    FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE SET NULL, 
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE app_versions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('api','app','backend'),
    version VARCHAR(50) NOT NULL,
    release_date DATE
);


DELIMITER //

CREATE PROCEDURE get_available_bikes(IN p_city_id INT)
BEGIN
    SELECT * FROM bikes WHERE city_id = p_city_id AND status = 'available';
END //

CREATE PROCEDURE start_ride(
    IN p_bike_id INT, 
    IN p_user_id INT, 
    IN p_start_lat DECIMAL(9,6), 
    IN p_start_long DECIMAL(9,6)
)
BEGIN
    INSERT INTO rides (bike_id, user_id, start_time, start_latitude, start_longitude, status)
    VALUES (p_bike_id, p_user_id, NOW(), p_start_lat, p_start_long, 'active');
    UPDATE bikes SET status='in_use' WHERE id=p_bike_id;
END //

CREATE PROCEDURE end_ride(
    IN p_ride_id INT, 
    IN p_end_lat DECIMAL(9,6), 
    IN p_end_long DECIMAL(9,6), 
    IN p_station_id INT, 
    IN p_zone_id INT
)
BEGIN
    UPDATE rides
    SET end_time = NOW(),
        end_latitude = p_end_lat,
        end_longitude = p_end_long,
        end_station_id = p_station_id,
        end_zone_id = p_zone_id,
        status = 'completed'
    WHERE id = p_ride_id;
    
    UPDATE bikes
    SET status='available', current_latitude=p_end_lat, current_longitude=p_end_long, last_station_id=p_station_id, last_zone_id=p_zone_id
    WHERE id = (SELECT bike_id FROM rides WHERE id=p_ride_id);
END //

CREATE PROCEDURE topup_balance(IN p_user_id INT, IN p_amount DECIMAL(10,2))
BEGIN
    UPDATE users SET balance = balance + p_amount WHERE id = p_user_id;
    INSERT INTO payments (user_id, amount, type, status) VALUES (p_user_id, p_amount, 'topup', 'completed');
END //

CREATE PROCEDURE pay_for_ride(IN p_user_id INT, IN p_ride_id INT, IN p_amount DECIMAL(10,2))
BEGIN
    UPDATE users SET balance = balance - p_amount WHERE id = p_user_id;
    INSERT INTO payments (user_id, ride_id, amount, type, status) VALUES (p_user_id, p_ride_id, p_amount, 'ride', 'completed');
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE insert_charging_station(
    IN p_name VARCHAR(100),
    IN p_city_id INT,
    IN p_latitude DECIMAL(9,6),
    IN p_longitude DECIMAL(9,6)
)
BEGIN
    INSERT INTO stations (name, city_id, latitude, longitude)
    VALUES (p_name, p_city_id, p_latitude, p_longitude);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE insert_parking_zone(
    IN p_name VARCHAR(100),
    IN p_city_id INT,
    IN p_latitude DECIMAL(9,6),
    IN p_longitude DECIMAL(9,6),
    IN p_radius INT
)
BEGIN
    INSERT INTO parking_zones (name, city_id, latitude, longitude, radius)
    VALUES (p_name, p_city_id, p_latitude, p_longitude, p_radius);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE insert_payment(
    IN p_user_id INT,
    IN p_ride_id INT,
    IN p_amount DECIMAL(10,2),
    IN p_type ENUM('topup','monthly','ride','refund'),
    IN p_status ENUM('pending','completed','failed'),
    IN p_provider VARCHAR(50),
    IN p_reference VARCHAR(100)
)
BEGIN
    INSERT INTO payments (user_id, ride_id, amount, type, status, payment_provider, payment_reference)
    VALUES (p_user_id, p_ride_id, p_amount, p_type, p_status, p_provider, p_reference);
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE insert_scooter(
    IN p_serial_number VARCHAR(100),
    IN p_city_id INT,
    IN p_lat DECIMAL(9,6),
    IN p_long DECIMAL(9,6)
)
BEGIN
    INSERT INTO bikes (serial_number, city_id, current_latitude, current_longitude)
    VALUES (p_serial_number, p_city_id, p_lat, p_long);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE insert_ride(
    IN p_bike_id INT,
    IN p_user_id INT,
    IN p_start_lat DECIMAL(9,6),
    IN p_start_long DECIMAL(9,6)
)
BEGIN
    INSERT INTO rides (
        bike_id, user_id, start_time, start_latitude, start_longitude, status
    )
    VALUES (
        p_bike_id, p_user_id, NOW(), p_start_lat, p_start_long, 'active'
    );

    UPDATE bikes
    SET status = 'in_use'
    WHERE id = p_bike_id;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE insert_user(
    IN p_email VARCHAR(255),
    IN p_password_hash VARCHAR(255),
    IN p_name VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_role ENUM('customer', 'admin')
)
BEGIN
    INSERT INTO users (email, password_hash, name, phone, role)
    VALUES (p_email, p_password_hash, p_name, p_phone, p_role);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE insert_city(
    IN p_name VARCHAR(100),
    IN p_region VARCHAR(100)
)
BEGIN
    INSERT INTO cities (name, region)
    VALUES (p_name, p_region);
END //

DELIMITER ;
