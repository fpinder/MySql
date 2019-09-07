ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'wdp260';
flush privileges;

DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id  INT NOT NULL AUTO_INCREMENT,
  product_name  VARCHAR(45) NULL,
  department_name varchar(45) NULL,
  price  DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  primary key (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ice Cream", "grocery", 3.50, 25),  ("Strawberry", "clothes" ,2.50, 5), ("Hammer", "Tools", 20.89, 25), ("Chocolate", "grocery", 4.65, 12), ("Strawberry", "grocery" ,2.50, 5),
("Bread", "grocery", 1.50, 22),  ("Shoes", "clothes" ,12.50, 53), ("Dril", "Tools", 40.50, 18), ("Sugar", "grocery", 2.65, 12), ("Eggs", "grocery" , 7.50, 5);