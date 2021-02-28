"use strict"

const config = require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const express = require("express");
const path = require("path");
const app = express();
const expressValidator = require("express-validator");


const modelUser = require("../models/modelUser");
const mUser = new modelUser(pool);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function router(request, response) {
    response.status(200);
    response.redirect("/index");
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function index(request, response) {
    response.status(200);
    response.render("index", { errorMsg: null });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function login(request, response) {
    mUser.isUserCorrect(request.body.correo,
        request.body.password,
        function(error, ok) {
            if (error) { // error de acceso a la base de datos
                response.status(500);
                response.render("index", { errorMsg: "Error interno de acceso a la base de datos" });
            } else if (ok.length > 0) {
                request.session.currentUser = request.body.correo;
                request.session.nombreUser = ok[0].nombre_user;
                request.session.imagen = ok[0].img;
                response.redirect("/home");

            } else {
                response.status(200);
                response.render("index", { errorMsg: "Email y/o contraseña no válidos" });
            }
        });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function signup(request, response) {
    response.status(200);
    response.render("signup", { errorMsg: null });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function signup_user(request, response) {

    let nombreImagen = null;
    if (request.file) {
        nombreImagen = request.file.filename;
    } else {
        let random = Math.floor(Math.random() * 5) + 1;
        nombreImagen = random + ".png";
    }
    let data_user = {
        email: request.body.correo,
        password: request.body.password,
        userName: request.body.userName,
        imagen: nombreImagen
    }

    let confirm_pass = request.body.password_again
    request.checkBody("correo", "el correo debe ser valido").isEmail();
    request.checkBody("userName", "nombre de usuario no válido").matches(/^[A-Z0-9]+$/i);
    request.checkBody("password", "contraseña debe tener entre 6 y 10 caracteres").isLength({ min: 6, max: 10 });
    request.checkBody("password", "ambas contraseñas deben coincidir").equals(confirm_pass);

    request.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            response.status(200);
            response.render("signup", { errorMsg: result.array() });
        } else {
            mUser.signup(data_user, function(error, ok) {
                if (error) {
                    response.status(500);
                    let err = [{ msg: error.message }];
                    response.render("signup", { errorMsg: err });
                } else if (ok) {
                    response.redirect("/index");
                } else {
                    response.status(200);
                    response.render("signup", { errorMsg: "Error de acceso a la base de datos" });
                }
            });
        }
    })

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function imagen(request, response) {
    let pathImg = path.join(__dirname, "../", "public", "img", request.params.id);
    response.sendFile(pathImg);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function home(request, response) {
    response.status(200);
    response.render("home", { nombre_user: response.locals.nombreUser, img: response.locals.img });
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function logout(request, response) {
    response.status(200);
    request.session.destroy()
    response.redirect("/index");
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function allUsers(request, response) {

    mUser.getAllUsers(function(err, result) {
        if (err) {
            response.status(200);
            response.redirect("/home");
        } else {
            response.status(200);
            response.render("allUsers", { nombre_user: response.locals.nombreUser, img: response.locals.img, users: result });

        }
    })

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function searchUsers(request, response) {

    let busqueda = request.body.buscar;
    mUser.searchUsers(busqueda, function(err, result) {
        if (err) {
            response.status(200);
            response.redirect("/home");
        } else {
            response.status(200);
            response.render("allUsers", { nombre_user: response.locals.nombreUser, img: response.locals.img, users: result });

        }
    })
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function getPerfil(request, response) {
    mUser.getUserInfo(request.params.nombre, function(err, result) {
        if (err) {
            response.status(200);
            response.redirect("/home");
        } else {
            response.status(200);
            response.render("perfilUser", { nombre_user: response.locals.nombreUser, img: response.locals.img, user: result });

        }

    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getMessages(request, response) {
    mUser.getMessages(response.locals.userEmail, function(err, mess) {
        if (err) {
            console.log(err);
            response.status(500);
        } else {
            response.status(200);
            response.render("messages", { nombre_user: response.locals.nombreUser, img: response.locals.img, mensajes: mess });
        }
    })

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function deleteMessage(request, response) {
    mUser.deleteMessage(request.params.id, function(err, result) {
        if (err) {
            console.log(err);
            response.status(500);
        } else {
            response.status(200);
            response.redirect("/users/messages");
        }
    })

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function sendMessages(request, response) {
    mUser.getUserMessages(response.locals.userEmail, function(err, users) {
        if (err) {
            console.log(err);
            response.status(500);
        } else {
            response.status(200);
            response.render("sendMessages", { nombre_user: response.locals.nombreUser, img: response.locals.img, users: users });
        }
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function sendMessagesProcess(request, response) {
    let data = {
        nombre: request.params.nombre,
        email: request.params.email,
        texto: request.body.texto
    }
    mUser.sendMessages(data, function(err, users) {
        if (err) {
            console.log(err);
            response.status(500);
        } else {
            response.status(200);
            response.redirect("/users/sendMessages");
        }
    })
}

//funcion para comprobar que ya haya un usuario registrado
function checkUser(request, response, next) {
    if (request.session.currentUser != null) {
        response.locals.userEmail = request.session.currentUser;
        response.locals.nombreUser = request.session.nombreUser;
        response.locals.img = request.session.imagen;
        next();
    } else {
        response.redirect("/index");
    }
}


module.exports = {
    router: router,
    index: index,
    login: login,
    imagen: imagen,
    home: home,
    logout: logout,
    signup: signup,
    signup_user: signup_user,
    checkUser: checkUser,
    allUsers: allUsers,
    searchUsers: searchUsers,
    getPerfil: getPerfil,
    getMessages: getMessages,
    deleteMessage: deleteMessage,
    sendMessages: sendMessages,
    sendMessagesProcess: sendMessagesProcess
};