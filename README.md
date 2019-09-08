# MySql

[MySql](https://github.com/fpinder/MySql)

**Object**

*This App doesn't have an HTML page. Therefore, I used screen captures to explain how it works. MySql app is an Amazon-like storefront that take in an order from the customers and deplete stock from the store's inventory. The app then prompt the user with two messages. The first ask the user for the ID of the product they would like to buy. The second message ask how many units of the product they would like to buy. However, if your store does have enough of the product, the app fulfill the customer's order. 
This means updating the SQL database to reflect the remaining quantity.
Once the update goes through, the app shows the customer the total cost of their purchase.*

`Customer Order request`

<a href="#"><img src="https://github.com/fpinder/MySql/blob/master/images/Capture2.JPG" alt="Customer request"></a>

*The app also has an error checking process to ensure the customer as enter the correct information, check if the store has enough of the product to meet the customer's request. If not, the app provides a phrase like Insufficient quantity!, and then prevent the order from going through.*

`Error Checking`

<a href="#"><img src="https://github.com/fpinder/MySql/blob/master/images/Capture1.JPG" alt="error checking"></a>

*The MySql also has a Manager View fuction that provides the manager with the following options;* *1) View Products for Sale.The app will list every available item (i.e. the item IDs, Names, Prices, and Quantities.* 

`View Products for Sale`

<a href="#"><img src="https://github.com/fpinder/MySql/blob/master/images/Capture3.JPG" alt="Products for Sale"></a>

2) *View Low Inventory. the appl will list all items with an inventory count lower than five.*

`View Low Inventory`

<a href="#"><img src="https://github.com/fpinder/MySql/blob/master/images/Capture4.JPG" alt="Low Inventory"></a>

3) *Add to Inventory. The app display a prompt that will let the manager add more of any item currently in the store.*

`Add to Inventory`

<a href="#"><img src="https://github.com/fpinder/MySql/blob/master/images/Capture5.JPG" alt="Add to Inventory"></a>

 4) *Add New Product. The app will allow the manager to add a completely new product to the store*

  `Add New Product`

  <a href="#"><img src="https://github.com/fpinder/MySql/blob/master/images/Capture6.JPG" alt="Add New Product"></a>

 
`View of the New Product Added`

<a href="#"><img src="https://github.com/fpinder/MySql/blob/master/images/Capture7.JPG" alt="New Product Added"></a>

*The app also has an error checking process for the Manager View fuction to ensure the customer as enter the correct information*

`Manager View fuction Error Checking`

<a href="#"><img src="https://github.com/fpinder/MySql/blob/master/images/Capture8.JPG" alt="Manager Error Checking"></a>

**_Technology used_**
This app uses JavaScript, Node.js and 5 NPM packages: MySql, Inquirer, Cli-table2, Chalk, and Dotenv

| Files Used   |  Role in the App                                                                  |
| ------------ | -------------------------------------------------------------------------------------- |
| node_modules | node modules includes the  NPM packages                                               |
| .env         | Invisible file that used by the dotenv package to set what are known as environment variables keys                              |
| .gitignore   | This will tell git not to track these files, and thus they won't be committed to Github |
| package.json | JSON Source file the has all the dependencies.                    |
| bamazonCustomer.js     | The Javascript file that includes all variables, functions and commands for the customer request. |
| bamazonManager.js     | The Javascript file that includes all variables, functions and commands for the Manager request. |
| productTable.sql   | The sql file to create the database and contents. |

**_Code excerpts_**

*I used a switch with "cases" to create four separate functions for the manager request (including a case to exit the menu):*

 ```switch (answer.action) {
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
```

#
Lincense by <a href="https://creativecommons.org/licenses/by/3.0/" rel="nofollow">CC-BY</a>
