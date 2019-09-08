var mysql = require("mysql");
var inquirer = require("inquirer")
var Table = require("cli-table2")
const chalk = require('chalk');
require("dotenv").config();

// Run the following for the new method to connect my sql in workbeach
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'wdp260';
// flush privileges;
var connection = mysql.createConnection({
    host: process.env.HOST,
    // Your port
    port: process.env.PORT,
    // Your username
    user: "root",
    // Your password
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

ItemId = "";
productName = ""
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});

function afterConnection() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    products();
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProducts();
                    break;
                case "Exit":
                    console.log(chalk.blueBright.bold("Good Bye"));
                    connection.end();
                    break;

            }
        });
}

function products() {
    var query = connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ["Product Id", "Prod. Description", "Cost", "Quantity"],
            colWidths: [12, 18, 8, 10],
            colAligns: ["center", "left", "right", "center"],
            style: {
                head: ["green"],
                compact: true
            }
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);

        }

        console.log("\n" + table.toString());
        // console.log(query.sql);
        afterConnection();
    });


}

function lowInventory() {
    var query = connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {

        if (err) throw err;

        var table = new Table({
            head: ["Product Id", "Prod. Description", "Cost", "Quantity"],
            colWidths: [12, 22, 8, 10],
            colAligns: ["center", "left", "right", "center"],
            style: {
                head: ["red"],
                compact: true
            }
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);

        }

        console.log("\n" + table.toString());
        // console.log(query.sql);
        afterConnection();
    });


}


function addInventory() {
    inquirer.prompt({
        name: "Item",
        type: "input",
        message: "Please enter the 'Product Id' for the inventory quantity you would like to update?"
    }).then(function (answer) {
        if (answer.Item.length === 0 || isNaN(answer.Item)) {
            console.log(chalk.white.bgRed.bold("\nPlease try again and ensure you selected an item number from the 'Product Id' list\n"))
            afterConnection();
        } else {
            var query = "SELECT item_id, product_name, stock_quantity, price FROM Products WHERE item_id = " + answer.Item;
            connection.query(query, function (err, results) {
                if (err) throw err;
                if (results.length === 0) {
                    console.log(chalk.white.blueBright.bold("The product doesn't exist. Please try again and select an item from the list"))
                    //connection.end();
                    addInventory();
                } else {
                    ItemId = results[0].item_id;
                    productName = results[0].product_name;
                    inquirer.prompt({
                        name: "Qty",
                        type: "input",
                        message: "\nHow many " + productName + " would you like to add?"
                    }).then(function (answer) {
                        if (answer.Qty.length === 0 || isNaN(answer.Qty)) {
                            console.log(chalk.white.bgRed.bold("Please Provide a numerical value for the Quantity"))
                            addInventory();
                        } else {
                            var query = connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [{
                                        stock_quantity: parseInt(answer.Qty) + parseInt(results[0].stock_quantity)
                                    },
                                    {
                                        item_id: ItemId
                                    }
                                ],
                                function (err, res) {
                                    if (err) throw err;
                                    console.log(res.affectedRows + " products updated!\n");
                                    afterConnection();
                                }
                            );

                            // logs the actual query being run
                            //console.log(query.sql);
                        }

                    })
                }
            })
        }
    })

}

function addProducts() {
    inquirer.prompt([{
            name: "prodName",
            type: "Input",
            message: "What is the Product Name for the item you would like to add"

        },
        {
            name: "prodDept",
            type: "Input",
            message: "What is the Department Name for the item you would like to add"

        },
        {
            name: "prodCost",
            type: "Input",
            message: "What is the Cost for the item you would like to add"

        },
        {
            name: "prodQty",
            type: "Input",
            message: "What is the Quantity for the item you would like to add"

        }

    ]).then(function (answer) {
        if (answer.prodName.length === 0 || answer.prodDept.length === 0 || answer.prodQty.length === 0 || isNaN(answer.prodQty) || answer.prodCost.length === 0 || isNaN(answer.prodCost)) {
            console.log("\nPlease ensure you entered a string value for the " + chalk.white.bgRed.bold('Product Name') + " and" + chalk.white.bgRed.bold(' Department Name') + " and a numeric value for the " + chalk.white.bgRed.bold("Cost") + " as well as a " + chalk.white.bgRed.bold("Quantity\n"));
            addProducts();
        } else {
            console.log("Inserting a new product...\n");
            var query = connection.query(
                "INSERT INTO products SET ?", {

                    product_name: answer.prodName,
                    department_name: answer.prodDept,
                    price: answer.prodCost,
                    stock_quantity: answer.prodQty
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + chalk.bold.magenta(" Product Added!\n"));
                    // Call updateProduct AFTER the INSERT completes
                    afterConnection();
                }
            );

            // logs the actual query being run
            console.log(query.sql);
        }
    })

}