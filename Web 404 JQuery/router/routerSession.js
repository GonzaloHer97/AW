"use strict"
const path = require("path");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const multer = require("multer");
const multerFactory = multer({ dest: path.join("./", "public", "img") });
router.use(bodyParser.urlencoded({ extended: true }));
//Controladores
const controllerUsuario = require("../controller/controllerUser");


//GET
router.get("/", controllerUsuario.router);

router.get("/index", controllerUsuario.index);

router.get("/signup", controllerUsuario.signup);

router.get("/home", controllerUsuario.checkUser, controllerUsuario.home);

router.get("/logout", controllerUsuario.checkUser, controllerUsuario.logout);

router.get("/imagen/:id", controllerUsuario.checkUser, controllerUsuario.imagen);




//POST
router.post("/login", controllerUsuario.login);

router.post("/signup_user", multerFactory.single("foto"), controllerUsuario.signup_user);

//export
module.exports = router;