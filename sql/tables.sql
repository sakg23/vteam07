USE elsparkcyklar;

-- DROP PROCEDURES (lägg till fler om du har fler)
DROP PROCEDURE IF EXISTS get_available_bikes;
DROP PROCEDURE IF EXISTS start_ride;
DROP PROCEDURE IF EXISTS end_ride;
DROP PROCEDURE IF EXISTS topup_balance;
DROP PROCEDURE IF EXISTS pay_for_ride;
DROP PROCEDURE IF EXISTS insert_city;


-- DROP TABLES (i omvänd relationsordning)
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

-- SKAPA TABELLER

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
    city_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    capacity INT DEFAULT 10,
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

CREATE TABLE parking_zones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NOT NULL,
    name VARCHAR(100),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    radius INT DEFAULT 50,
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

CREATE TABLE bikes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    city_id INT NOT NULL,
    status ENUM('available','in_use','maintenance','charging','out_of_order') DEFAULT 'available',
    battery_level INT DEFAULT 100,
    current_latitude DECIMAL(9,6),
    current_longitude DECIMAL(9,6),
    last_station_id INT,
    last_zone_id INT,
    is_free_parking BOOLEAN DEFAULT FALSE,
    last_ride_id INT,
    FOREIGN KEY (city_id) REFERENCES cities(id),
    FOREIGN KEY (last_station_id) REFERENCES stations(id),
    FOREIGN KEY (last_zone_id) REFERENCES parking_zones(id)
);

CREATE TABLE free_parking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bike_id INT NOT NULL,
    user_id INT,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    FOREIGN KEY (bike_id) REFERENCES bikes(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE rides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bike_id INT NOT NULL,
    user_id INT NOT NULL,
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
    FOREIGN KEY (bike_id) REFERENCES bikes(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (start_station_id) REFERENCES stations(id),
    FOREIGN KEY (end_station_id) REFERENCES stations(id),
    FOREIGN KEY (start_zone_id) REFERENCES parking_zones(id),
    FOREIGN KEY (end_zone_id) REFERENCES parking_zones(id)
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ride_id INT,
    amount DECIMAL(10,2) NOT NULL,
    type ENUM('topup','monthly','ride','refund') NOT NULL,
    status ENUM('pending','completed','failed') DEFAULT 'pending',
    payment_provider VARCHAR(50),
    payment_reference VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (ride_id) REFERENCES rides(id)
);

CREATE TABLE bike_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bike_id INT NOT NULL,
    event_type ENUM('move','stop','lock','unlock','maintenance','battery_low','charging','manual_override'),
    timestamp DATETIME NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    details TEXT,
    user_id INT,
    ride_id INT,
    FOREIGN KEY (bike_id) REFERENCES bikes(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (ride_id) REFERENCES rides(id)
);

CREATE TABLE maintenance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bike_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    type ENUM('battery','mechanical','software','other'),
    description TEXT,
    status ENUM('open','closed') DEFAULT 'open',
    performed_by INT,
    FOREIGN KEY (bike_id) REFERENCES bikes(id),
    FOREIGN KEY (performed_by) REFERENCES users(id)
);

CREATE TABLE app_versions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('api','app','backend'),
    version VARCHAR(50) NOT NULL,
    release_date DATE
);

-- PROCEDURER LÄNGST NER I SAMMA FIL

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
CREATE PROCEDURE insert_city(
    IN p_name VARCHAR(100),
    IN p_region VARCHAR(100)
)
BEGIN
    INSERT INTO cities (name, region) VALUES (p_name, p_region);
END //
DELIMITER ;
