"use strict"

const config = require("../config");
const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const modelUser = require("../models/modelUser");
const mUser = new modelUser(pool);
const modelQuestion = require("../models/modelQuestion");
const mQuestion = new modelQuestion(pool);
const modelAnswer = require("../models/modelAnswer");
const mAnswer = new modelAnswer(pool);
//////////////////////////////////////////////////////


function allQuestions(request, response) {
    mQuestion.getAllInfoQuestions(function(error, questions) {
        if (error) {
            response.status(500);
            response.redirect("/index");
        } else {
            response.render("allQuestions", { nombre_user: response.locals.nombreUser, img: response.locals.img, question_list: questions });
        }
    })
}


function newQuestion(request, response) {
    response.status(500);
    response.render("newQuestion", { nombre_user: response.locals.nombreUser, img: response.locals.img });
}


function addNewQuestion(request, response) {

    let tags = createTask(request.body.etiquetas);
    let newTags = [...new Set(tags.tags)];

    let dataQuestion = {
        titulo: request.body.titulo,
        texto: request.body.texto,
        userEmail: response.locals.userEmail,
        tags: newTags
    }

    mQuestion.insertQuestion(dataQuestion, function(error, ok) {
        if (error) {
            response.status(500);
            response.render("newQuestion", { nombre_user: response.locals.nombreUser, img: response.locals.img });
        } else {
            response.status(500);
            response.redirect("/questions");
        }

    });
}


function searchQuestionByString(request, response) {
    let busqueda = request.body.buscar;
    if (busqueda === "") {
        response.redirect("/questions");
    } else {
        mQuestion.searchQuestionByString(busqueda, function(err, questions) {
            if (err) {
                response.redirect("/questions");
            } else {
                response.status(500);
                response.render("searchQuestionByString", { nombre_user: response.locals.nombreUser, img: response.locals.img, question_list: questions, buscado: busqueda });
            }
        })
    }
}

function searchQuestionByTags(request, response) {
    let busqueda = "@" + request.body.buscar;
    if (busqueda === "") {
        response.redirect("/questions");
    } else {
        mQuestion.searchQuestionByTags(busqueda, function(err, questions) {
            if (err) {
                response.redirect("/questions");
            } else {
                response.status(500);
                response.render("searchQuestionByTags", { nombre_user: response.locals.nombreUser, img: response.locals.img, question_list: questions, buscado: busqueda });
            }
        })
    }
}


function infoQuestion(request, response) {

    let data = {
        id: request.params.id,
        name: request.params.name
    }

    mQuestion.checkUserQuestion(request.params.id, response.locals.userEmail, function(err, question) {
        if (err) {
            response.status(500);
            response.redirect("/questions");
        } else {
            mQuestion.getOneQuestion(request.params.id, function(err, questions) {
                if (err) {
                    response.status(500);
                    response.redirect("/questions");
                } else {
                    mAnswer.getAnswerByQuestion(questions[0].id, function(err, answers) {
                        if (err) {
                            response.status(500);
                            response.redirect("/questions");

                        } else {
                            if (question) {
                                mUser.addMedalVisit(data, function(err, result) {
                                    if (err) {
                                        response.status(500);
                                        response.redirect("/questions");
                                    } else {
                                        response.status(500);
                                        response.render("infoQuestion", { nombre_user: response.locals.nombreUser, img: response.locals.img, question: questions[0], answers: answers });
                                    }
                                })
                            } else {
                                response.status(500);
                                response.render("infoQuestion", { nombre_user: response.locals.nombreUser, img: response.locals.img, question: questions[0], answers: answers });
                            }

                        }
                    })

                }
            });
        }
    })
}

function addNewAnswer(request, response) {

    let data = {
        texto: request.body.respuesta,
        id_pregunta: request.params.id,
        user: response.locals.userEmail
    }

    mAnswer.addNewAnswer(data, function(err, result) {
        if (err) {
            response.status(500);
            response.redirect("/questions");
        } else {
            response.status(500);
            response.redirect("/questions");
        }
    })


}


function withoutAnswers(request, response) {

    mQuestion.withoutAnswers(function(err, questions) {
        if (err) {
            response.status(500);
            response.redirect("/questions");
        } else {
            response.status(500);
            response.render("withoutAnswers", { nombre_user: response.locals.nombreUser, img: response.locals.img, question_list: questions });
        }
    })

}


function updateVotesQuestion(request, response) {
    let v;

    if (request.body.like != null) {
        v = "like";
    } else if (request.body.dislike != null) {
        v = "dislike";
    }

    let data = {
        id: request.params.id,
        email: request.params.emailQuestion,
        vote: v,
        correo_user: response.locals.userEmail
    }

    mQuestion.updateVotes(data, function(err, result) {
        if (err) {
            response.status(500);
            response.redirect("/questions");
        } else {
            if (result) {
                mUser.updateReputacion(data, function(err, result) {
                    if (err) {
                        response.status(500);
                        response.redirect("/questions");
                    } else {
                        mUser.addMedalQuestion(data, function(err, result) {
                            if (err) {
                                response.status(500);
                                response.redirect("/questions");
                            } else {
                                response.status(500);
                                let ruta = "/questions/infoQuestion/" + request.params.id + "/" + request.params.emailQuestion;
                                response.redirect(ruta);
                            }
                        })
                    }
                })
            } else {
                response.status(500);
                let ruta = "/questions/infoQuestion/" + request.params.id + "/" + request.params.emailQuestion;
                response.redirect(ruta);
            }
        }
    })
}


function updateVotesAnswer(request, response) {

    let v;
    if (request.body.like != null) {
        v = "like";
    } else if (request.body.dislike != null) {
        v = "dislike";
    }

    let data = {
        id_a: request.params.id_a,
        email: request.params.emailQuestion,
        vote: v,
        correo_user: response.locals.userEmail
    }

    mAnswer.updateVotes(data, function(err, result) {
        if (err) {
            response.status(500);
            response.redirect("/questions");
        } else {
            if (result) {
                mUser.updateReputacion(data, function(err, result) {
                    if (err) {
                        response.status(500);
                        response.redirect("/questions");
                    } else {
                        mUser.addMedalAnswer(data, function(err, result) {
                            if (err) {
                                response.status(500);
                                response.redirect("/questions");
                            } else {
                                response.status(500);
                                let ruta = "/questions/infoQuestion/" + request.params.id_q + "/" + request.params.emailQuestion;
                                response.redirect(ruta);
                            }
                        })

                    }
                })
            } else {
                response.status(500);
                let ruta = "/questions/infoQuestion/" + request.params.id_q + "/" + request.params.emailQuestion;
                response.redirect(ruta);
            }
        }
    })
}



function createTask(text) {
    let tags = text.match(/@+\w*/g);
    let texto = text.replace(/@+\w*/g, "").trim();
    return { text: texto, tags: tags };
}

module.exports = {
    allQuestions: allQuestions,
    newQuestion: newQuestion,
    addNewQuestion: addNewQuestion,
    searchQuestionByString: searchQuestionByString,
    searchQuestionByTags: searchQuestionByTags,
    infoQuestion: infoQuestion,
    addNewAnswer: addNewAnswer,
    withoutAnswers: withoutAnswers,
    updateVotesQuestion: updateVotesQuestion,
    updateVotesAnswer: updateVotesAnswer
}