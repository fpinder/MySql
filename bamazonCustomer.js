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

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});

function afterConnection() {
    var query = connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ["Product Id", "Product Description", "Cost"],
            colWidths: [12, 20, 8],
            colAligns: ["center", "left", "right"],
            style: {
                head: ["blue"],
                compact: true
            }
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].price]);

        }

        console.log(table.toString());
        shop();
    });
}

function shop() {
    inquirer.prompt({
        name: "Item",
        type: "input",
        message: "Please enter the 'Product Id' you would like to purchase?"
    }).then(function (answer) {
        if (answer.Item.length === 0) {
            console.log(chalk.white.bgRed.bold("\nPlease try again and ensure you selected an item number from the 'Product Id' list"))
            afterConnection();
        } else {
            var query = "SELECT item_id, stock_quantity, price FROM Products WHERE item_id = " + answer.Item;
            connection.query(query, function (err, results) {
                //console.log(results)
                if (err) throw err;
                if (results.length === 0) {
                    console.log(chalk.white.blueBright.bold("The product doesn't exist. Please try again and select an item from the list"))
                    //connection.end();
                    shop();
                } else {
                    inquirer.prompt({
                        name: "Qty",
                        type: "input",
                        message: "\nHow many units of the product you selected would you like to purchase?"
                    }).then(function (answer) {
                        if (answer.Qty.length == 0 || answer.Qty > results[0].stock_quantity) {
                            console.log(chalk.white.bgRed.bold("\n'Insufficient quantity!'\n") + chalk.white.blueBright.bold("\nWe are sorry we only have " + results[0].stock_quantity + " items. Therefore, we can not fill your request for " + answer.Qty + " Unit"))
                            connection.end();
                        } else {

                            // console.log(results)
                            var qtyRequested = answer.Qty;
                            var itemNumber = results[0].item_id;
                            var onHandQty = results[0].stock_quantity
                            var transaction = onHandQty - qtyRequested
                            updateProduct(itemNumber, transaction);
                            console.log(chalk.white.bgRed.bold("\nTransaction Completed...\n") + chalk.bold.magenta("Quantity Requested: " + answer.Qty + "\n" + "Unit Price: $" + results[0].price + "\nTaxes: $" + ((answer.Qty * results[0].price) * .09).toFixed(2) + "\nTotal" + " = $" + ((answer.Qty * results[0].price) * 1.09).toFixed(2)));
                            connection.end();
                        }

                    })
                }
            })
        }
    })
}

function updateProduct(itemNumber, transaction) {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
                stock_quantity: transaction
            },
            {
                item_id: itemNumber
            }
        ],
        function (err, res) {
            if (err) throw err;
            //console.log(res.affectedRows + " products updated!\n");
        }
    );

    // logs the actual query being run
    //console.log(query.sql);
}