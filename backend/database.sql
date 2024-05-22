create database tech_data;

use tech_data;

-- Table for Users (including Admins)
CREATE TABLE user (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user'
);

-- Table for Products
CREATE TABLE product (
    id_product INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    descriptions TEXT,
    price DECIMAL(20, 2) NOT NULL,
    img_url longblob not null,
    img_url_sec longblob null,
    stock_quantity INT NOT NULL
);

-- Table for Orders
CREATE TABLE `order` (
    id_order INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES user(id_user)
);

-- Table for Order Items
CREATE TABLE order_item (
    id_order_detail INT AUTO_INCREMENT PRIMARY KEY,
    id_order INT,
    id_product INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_order) REFERENCES `order`(id_order),
    FOREIGN KEY (id_product) REFERENCES product(id_product)
);

-- Table for Bills
CREATE TABLE bill (
    id_bill INT AUTO_INCREMENT PRIMARY KEY,
    id_order INT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('banking', 'cash') NOT NULL,
    bill_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_order) REFERENCES `order`(id_order)
);

-- Table for Carts
CREATE TABLE cart (
    id_cart INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    FOREIGN KEY (id_user) REFERENCES user(id_user)
);

-- Table for Cart Items
CREATE TABLE cart_item (
    id_cart_detail INT AUTO_INCREMENT PRIMARY KEY,
    id_cart INT,
    id_product INT,
    quantity INT NOT NULL,
    FOREIGN KEY (id_cart) REFERENCES cart(id_cart),
    FOREIGN KEY (id_product) REFERENCES product(id_product)
);
