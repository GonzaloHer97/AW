//-----------Modulos de node
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const expressValidator = require("express-validator");
// Configuracion de la conezion a la BBDD y puerto de escucha del server
const config = require("./config");
// Crear un servidor Express.js
const app = express();
//////express-validator///////
app.use(expressValidator());
//------------Gestion de session de usuario
const session = require("express-session");
const mysqlSession = require("express-mysql-session");

const MySQLStore = mysqlSession(session);
const mysql = require("mysql");
const fs = require("fs");

const routerS = require("./router/routerSession");
const routerQ = require("./router/routerQuestion");
const routerU = require("./router/routerUser")


// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

//Crear instancia de MySQLStore
const sessionStore = new MySQLStore(config.mysqlConfig);
const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});
const multerFactory = multer();

app.use(middlewareSession);


// Arrancar el servidor
app.listen(config.port, function(err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use("/", routerS);
app.use("/users", routerU);
app.use("/questions", routerQ);

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).render("errors/err500", { error: err });
});



app.use(function(req, res, next) {
    res.status(404).render("errors/err404");
});