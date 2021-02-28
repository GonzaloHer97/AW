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
router.get("/", controllerUsuario.checkUser, controllerUsuario.allUsers);

router.get("/perfil/:nombre", controllerUsuario.checkUser, controllerUsuario.getPerfil);



//POST

router.post("/searchUsers", controllerUsuario.checkUser, controllerUsuario.searchUsers)

//export
module.exports = router;