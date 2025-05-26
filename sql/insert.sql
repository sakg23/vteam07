USE elsparkcyklar;

-- USERS
INSERT INTO users (email, password_hash, name, phone, role)
VALUES
('admin@elspark.se', 'hash1', 'Admin', '0700000001', 'admin'),
('user1@elspark.se', 'hash2', 'Kund Ett', '0700000002', 'customer'),
('user2@elspark.se', 'hash3', 'Kund Två', '0700000003', 'customer');

-- CITIES
INSERT INTO cities (name, region)
VALUES
('Stockholm', 'Stockholm'),
('Göteborg', 'Västra Götaland'),
('Malmö', 'Skåne');

-- STATIONS (kopplade till city-id)
INSERT INTO stations (city_id, name, latitude, longitude, capacity)
VALUES
(1, 'Centralstationen', 59.3293, 18.0686, 15),
(1, 'Kista', 59.4056, 17.9442, 12),
(2, 'Centralen', 57.7072, 11.9668, 10),
(3, 'Triangeln', 55.5956, 13.0007, 10);

-- PARKING_ZONES (kopplade till city-id)
INSERT INTO parking_zones (city_id, name, latitude, longitude, radius)
VALUES
(1, 'Kungsträdgården', 59.3310, 18.0702, 50),
(2, 'Avenyn', 57.7000, 11.9730, 50),
(3, 'Malmö Live', 55.6075, 12.9985, 50);

-- BIKES (kopplade till city-id, stations och zones med null tills rides sker)
INSERT INTO bikes (serial_number, city_id, status, battery_level, current_latitude, current_longitude, last_station_id, last_zone_id, is_free_parking)
VALUES
('BIKE1001', 1, 'available', 90, 59.3293, 18.0686, 1, 1, FALSE),
('BIKE2001', 2, 'available', 100, 57.7072, 11.9668, 3, 2, FALSE),
('BIKE3001', 3, 'charging', 80, 55.5956, 13.0007, 4, 3, FALSE);

-- FREE_PARKING (kopplade till bike och user)
INSERT INTO free_parking (bike_id, user_id, latitude, longitude, start_time, end_time)
VALUES
(1, 2, 59.3295, 18.0700, NOW() - INTERVAL 1 HOUR, NULL),
(2, 3, 57.7080, 11.9700, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR);

-- RIDES (kopplade till bike, user, station, zones)
INSERT INTO rides (bike_id, user_id, start_time, end_time, start_latitude, start_longitude, end_latitude, end_longitude, start_station_id, end_station_id, start_zone_id, end_zone_id, distance_meters, cost, status)
VALUES
(1, 2, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 30 MINUTE, 59.3293, 18.0686, 59.3310, 18.0702, 1, 1, 1, 1, 1200, 25.00, 'completed'),
(2, 3, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR, 57.7072, 11.9668, 57.7000, 11.9730, 3, 3, 2, 2, 900, 18.00, 'completed');

-- PAYMENTS (kopplade till user och ride)
INSERT INTO payments (user_id, ride_id, amount, type, status, payment_provider, payment_reference)
VALUES
(2, 1, 25.00, 'ride', 'completed', 'Swish', 'REF123456'),
(3, 2, 18.00, 'ride', 'completed', 'Kort', 'REF654321'),
(2, NULL, 100.00, 'topup', 'completed', 'Swish', 'REF111222');

-- BIKE_LOGS (kopplade till bike, user, ride)
INSERT INTO bike_logs (bike_id, event_type, timestamp, latitude, longitude, details, user_id, ride_id)
VALUES
(1, 'move', NOW() - INTERVAL 1 HOUR, 59.3293, 18.0686, 'Startad färd', 2, 1),
(2, 'move', NOW() - INTERVAL 2 HOUR, 57.7072, 11.9668, 'Startad färd', 3, 2);

-- MAINTENANCE (kopplade till bike och user)
INSERT INTO maintenance (bike_id, start_time, end_time, type, description, status, performed_by)
VALUES
(1, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 2 DAY, 'battery', 'Batteribyte', 'closed', 1),
(2, NOW() - INTERVAL 5 DAY, NULL, 'mechanical', 'Bromskontroll', 'open', 1);

-- APP_VERSIONS
INSERT INTO app_versions (type, version, release_date)
VALUES
('api', '1.0.0', '2024-05-01'),
('app', '1.0.1', '2024-05-10'),
('backend', '1.0.2', '2024-05-15');
