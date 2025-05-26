DROP USER IF EXISTS 'dbadm'@'localhost';
CREATE USER 'dbadm'@'localhost' IDENTIFIED BY 'P@ssw0rd';
GRANT ALL PRIVILEGES ON elsparkcyklar.* TO 'dbadm'@'localhost';
FLUSH PRIVILEGES;
