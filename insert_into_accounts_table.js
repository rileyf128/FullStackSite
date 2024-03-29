/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

const mysql = require("mysql");
const bcrypt = require('bcrypt');

const dbCon = mysql.createConnection({
 
});

console.log("Attempting database connection");
dbCon.connect(function (err) {
    if (err) {
        throw err;
    }

    console.log("Connected to database!");

    const saltRounds = 10;
    const myPlaintextPassword = 'tango'; // replace with password chosen by you OR retain the same value
    const passwordHash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

    const rowToBeInserted = {
        acc_name: 'charlie',            // replace with acc_name chosen by you OR retain the same value
        acc_login: 'charlie',           // replace with acc_login chosen by you OR retain the same value
        acc_password: passwordHash      
    };
    
    const myPlaintextPassword2 = 'admin%'; // replace with password chosen by you OR retain the same value
    const passwordHash2 = bcrypt.hashSync(myPlaintextPassword2, saltRounds);

    const rowToBeInserted2 = {
        acc_name: 'admin$',            // replace with acc_name chosen by you OR retain the same value
        acc_login: 'admin$',           // replace with acc_login chosen by you OR retain the same value
        acc_password: passwordHash2      
    };

    console.log("Attempting to insert record into tbl_accounts");
    dbCon.query('INSERT tbl_accounts SET ?', rowToBeInserted, function (err, result) {
        if (err) {
            throw err;
        }
        console.log("Table record inserted!");
    });
    
 dbCon.query('INSERT tbl_accounts SET ?', rowToBeInserted2, function (err, result) {
        if (err) {
            throw err;
        }
        console.log("Table record inserted!");
    });


    dbCon.end();
});
