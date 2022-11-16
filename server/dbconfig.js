const mysql = require('mysql')
require("dotenv").config()



let con;
let amazondb = false

if (amazondb) {
    con = mysql.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    });
} else {
 
    con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "showyourproject",
        port: "3306"
    })
}

con.connect(err => {
    if (err) {
        return console.log("🤬", err);
    }
    console.log("connected to mysql server 👌");
})

const SQL = (q) => {
    return new Promise((resolve, reject) => {
        con.query(q, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}


module.exports = { SQL , con }