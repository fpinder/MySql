var mysql = require("mysql");
var inquirer = require("inquirer")
var Table = require("cli-table2")

// Run the following for the new method to connect my sql in workbeach
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'wdp260';
// flush privileges;

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "wdp260",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ["Product Id", "Product Description", "Cost"],
            colWidths: [12, 20, 6],
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
        console.log("");
    });

    var shop = () {
            inquirer.prompt({
                    name: "Item",
                    type: "input",
                    message: "What is the 'Item' numuber of the product you would like to buy?"
                }.then(function (answer) {
                    if (answer.Item <= 0 || answer.Item == "" || answer.Item > res.length) {
                        console.log("The product doesn't exist..Please select and item from the list")
                        // afterConnection();
                    } else {
                        console.log("Wow")
                        // afterConnection();
                    }

                    // console.log("Item: " + res[i].item_id + " | " + " product: " + res[i].product_name + " | " + "Price: " + "| " + res[i].price);
                    // connection.end();
                });
            }