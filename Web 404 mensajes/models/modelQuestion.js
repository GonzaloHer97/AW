"use strict";

class modelQuestions {
    constructor(pool) {
        this.pool = pool;
    }

    insertQuestion(data_question, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("INSERT INTO question (titulo, texto, correo_user) VALUES (?, ?, ?)", [data_question.titulo, data_question.texto, data_question.userEmail],
                    function(err, resultado) {
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos de question"));
                        } else {
                            if (data_question.tags == null || data_question.tags.length == 0) {
                                connection.release();
                                callback(null, true);
                            } else {
                                let taglist = [];
                                data_question.tags.forEach(e => { taglist.push([resultado.insertId, e]) });

                                connection.query("INSERT IGNORE INTO tags (id_p,nombre) VALUES ?", [taglist],
                                    function(err, resultado) {
                                        connection.release();
                                        if (err) {
                                            callback(new Error("Error al meter los tags en la base de datos"));
                                        } else {
                                            callback(null, true);
                                        }
                                    })

                            }

                        }
                    });
            }
        });
    }


    /*getAllQuestions(callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM question ORDER BY fecha DESC",
                    function(err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos de question"));
                        } else {
                            let questions = [];
                            let q;
                            if (result.length > 0) {
                                result.forEach(row => {
                                    q = {
                                        id: row.id_pregunta,
                                        titulo: row.titulo,
                                        texto: row.texto,
                                        fecha: new Date(row.fecha).getDate() + "-" + (new Date(row.fecha).getMonth() + 1) + "-" + new Date(row.fecha).getFullYear(),
                                        correo_user: row.correo_user,
                                    }
                                    questions.push(q);
                                })
                            }
                            callback(null, questions);
                        }

                    })
            }
        });
    }*/

    getAllInfoQuestions(callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM question JOIN user ON question.correo_user = user.email LEFT JOIN tags ON tags.id_p = question.id_pregunta ORDER BY question.fecha DESC",
                    function(err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos de question"));
                        } else {
                            let questions = [];
                            let q;
                            if (result.length > 0) {
                                result.forEach(row => {
                                    if (questions.find(question => question.id == row.id_pregunta) != null) {
                                        questions[questions.indexOf(questions.find(question => question.id == row.id_pregunta))].tags.push(row.nombre);
                                    } else {
                                        q = {
                                            id: row.id_pregunta,
                                            titulo: row.titulo,
                                            texto: row.texto,
                                            fecha: new Date(row.fecha).getDate() + "-" + (new Date(row.fecha).getMonth() + 1) + "-" + new Date(row.fecha).getFullYear(),
                                            correo_user: row.correo_user,
                                            nombre: row.nombre_user,
                                            imagen: row.img,
                                            tags: [row.nombre]
                                        }
                                        questions.push(q);
                                    }
                                })
                            }
                            callback(null, questions);
                        }

                    })
            }
        });
    }

    getOneQuestion(id, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM question JOIN user ON question.correo_user = user.email LEFT JOIN tags ON tags.id_p = question.id_pregunta WHERE question.id_pregunta = ?", [id],
                    function(err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos de question"));
                        } else {
                            let questions = [];
                            let q;
                            if (result.length > 0) {
                                result.forEach(row => {
                                    if (questions.find(question => question.id == row.id_pregunta) != null) {
                                        questions[questions.indexOf(questions.find(question => question.id == row.id_pregunta))].tags.push(row.nombre);
                                    } else {
                                        q = {
                                            id: row.id_pregunta,
                                            titulo: row.titulo,
                                            texto: row.texto,
                                            fecha: new Date(row.fecha).getDate() + "-" + (new Date(row.fecha).getMonth() + 1) + "-" + new Date(row.fecha).getFullYear(),
                                            correo_user: row.correo_user,
                                            nombre: row.nombre_user,
                                            imagen: row.img,
                                            tags: [row.nombre],
                                            visitas: row.visitas,
                                            v_positivo: row.voto_positivo,
                                            v_negativo: row.voto_negativo
                                        }
                                        questions.push(q);
                                    }
                                })
                            }
                            callback(null, questions);
                        }

                    })
            }
        });

    }

    searchQuestionByString(busqueda, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM question JOIN user ON question.correo_user = user.email LEFT JOIN tags ON tags.id_p = question.id_pregunta WHERE question.titulo LIKE  ?  OR question.texto LIKE ? ORDER BY question.fecha DESC", ["%" + busqueda + "%", "%" + busqueda + "%"],
                    function(err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos de question"));
                        } else {
                            let questions = [];
                            let q;
                            if (result.length > 0) {
                                result.forEach(row => {
                                    if (questions.find(question => question.id == row.id_pregunta) != null) {
                                        questions[questions.indexOf(questions.find(question => question.id == row.id_pregunta))].tags.push(row.nombre);
                                    } else {
                                        q = {
                                            id: row.id_pregunta,
                                            titulo: row.titulo,
                                            texto: row.texto,
                                            fecha: new Date(row.fecha).getDate() + "-" + (new Date(row.fecha).getMonth() + 1) + "-" + new Date(row.fecha).getFullYear(),
                                            correo_user: row.correo_user,
                                            nombre: row.nombre_user,
                                            imagen: row.img,
                                            tags: [row.nombre]
                                        }
                                        questions.push(q);
                                    }
                                })
                            }
                            callback(null, questions);
                        }

                    })
            }
        });
    }



    searchQuestionByTags(busqueda, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM question JOIN user ON question.correo_user = user.email LEFT JOIN tags ON tags.id_p = question.id_pregunta ORDER BY question.fecha DESC",
                    function(err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos de question"));
                        } else {
                            let questions = [];
                            let questionsFinal = [];
                            let q;
                            if (result.length > 0) {
                                result.forEach(row => {
                                    if (questions.find(question => question.id == row.id_pregunta) != null) {
                                        questions[questions.indexOf(questions.find(question => question.id == row.id_pregunta))].tags.push(row.nombre);
                                    } else {
                                        q = {
                                            id: row.id_pregunta,
                                            titulo: row.titulo,
                                            texto: row.texto,
                                            fecha: new Date(row.fecha).getDate() + "-" + (new Date(row.fecha).getMonth() + 1) + "-" + new Date(row.fecha).getFullYear(),
                                            correo_user: row.correo_user,
                                            nombre: row.nombre_user,
                                            imagen: row.img,
                                            tags: [row.nombre]
                                        }
                                        questions.push(q);
                                    }
                                })
                                questions.forEach(q => {
                                    if (q.tags.find(tag => tag == busqueda)) {
                                        questionsFinal.push(q);
                                    }
                                })
                            }
                            callback(null, questionsFinal);
                        }

                    })
            }
        });
    }


    withoutAnswers(callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM question JOIN user ON question.correo_user = user.email LEFT JOIN tags ON tags.id_p = question.id_pregunta LEFT JOIN answer ON question.id_pregunta = answer.answer_id_pregunta ORDER BY question.fecha DESC",
                    function(err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al seleccionar las preguntas sin respuesta"));
                        } else {

                            let questions = [];
                            let q;
                            if (result.length > 0) {
                                result.forEach(row => {
                                    if (row.id_respuesta == null) {
                                        if (questions.find(question => question.id == row.id_pregunta) != null) {
                                            questions[questions.indexOf(questions.find(question => question.id == row.id_pregunta))].tags.push(row.nombre);
                                        } else {
                                            q = {
                                                id: row.id_pregunta,
                                                titulo: row.titulo,
                                                texto: row.texto,
                                                fecha: new Date(row.fecha).getDate() + "-" + (new Date(row.fecha).getMonth() + 1) + "-" + new Date(row.fecha).getFullYear(),
                                                correo_user: row.correo_user,
                                                nombre: row.nombre_user,
                                                imagen: row.img,
                                                tags: [row.nombre]
                                            }
                                            questions.push(q);
                                        }
                                    }
                                })

                            }
                            callback(null, questions);
                        }
                    })

            }
        })
    }




    checkUserQuestion(id_pregunta, userEmail, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM join_user_question WHERE join_user_question_correo_user	 = ? AND join_user_question_id_pregunta = ?", [userEmail, id_pregunta],
                    function(err, question) {
                        if (err) {
                            connection.release();
                            callback(new Error("Error al acceder a join_user_question"));
                        } else {
                            if (question.length == 0) {
                                connection.query("INSERT INTO join_user_question (join_user_question_correo_user,join_user_question_id_pregunta) VALUES (?,?)", [userEmail, id_pregunta],
                                    function(err, result) {
                                        connection.release();
                                        if (err) {
                                            callback(new Error("Error al insertar en join_user_question"));
                                        } else {
                                            callback(null, true);
                                        }

                                    })
                            } else {
                                connection.release();
                                callback(null, false);
                            }
                        }
                    })
            }
        })
    }

    updateVotes(data, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM join_user_question_votes WHERE join_user_question_votes_correo_user = ? AND join_user_question_votes_id_pregunta = ?", [data.correo_user, data.id],
                    function(err, vote) {
                        if (err) {
                            callback(new Error("Error al acceder a join_user_question_votes"));
                        } else {
                            if (vote.length == 0) {
                                connection.query("INSERT INTO join_user_question_votes (join_user_question_votes_correo_user,join_user_question_votes_id_pregunta) VALUES (?,?)", [data.correo_user, data.id],
                                    function(err, result) {
                                        if (err) {
                                            callback(new Error("Error al insertar en join_user_question_votes"));
                                        } else {
                                            if (data.vote == "like") {
                                                connection.query("UPDATE question SET voto_positivo = voto_positivo + 1, question_puntos = question_puntos + 1 WHERE question.id_pregunta = ?", [data.id],
                                                    function(err, result2) {
                                                        connection.release();
                                                        if (err) {
                                                            callback(new Error("Error al actualizar la tabla question"));
                                                        } else {
                                                            callback(null, true);
                                                        }
                                                    });
                                            } else {
                                                connection.query("UPDATE question SET voto_negativo = voto_negativo + 1, question_puntos = question_puntos - 1 WHERE question.id_pregunta = ?", [data.id],
                                                    function(err, result2) {
                                                        connection.release();
                                                        if (err) {
                                                            callback(new Error("Error al actualizar la tabla question"));
                                                        } else {
                                                            callback(null, true);
                                                        }
                                                    });
                                            }
                                        }
                                    })
                            } else {
                                connection.release();
                                callback(null, false);
                            }

                        }
                    })
            }
        })
    }



}

module.exports = modelQuestions;