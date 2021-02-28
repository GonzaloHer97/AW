"use strict";


class modelAnswer {
    constructor(pool) {
        this.pool = pool;
    }

    addNewAnswer(data, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("INSERT INTO answer (answer_texto,answer_correo_user,answer_id_pregunta) VALUES (?,?,?)", [data.texto, data.user, data.id_pregunta],
                    function(err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al insertar una respuesta en la base de datos"));
                        } else {
                            callback(null, true);
                        }
                    })
            }
        })
    }

    getAnswerByQuestion(id, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));

            } else {
                connection.query("SELECT * FROM answer JOIN user ON answer.answer_correo_user = user.email WHERE answer.answer_id_pregunta = ? ORDER BY answer.answer_puntos DESC", [id],
                    function(err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al seleccionar las respuestas en la base de datos"));
                        } else {
                            let answers = [];
                            let a;
                            result.forEach(row => {
                                a = {
                                    correo_user: row.answer_correo_user,
                                    id_question: row.answer_id_pregunta,
                                    fecha: new Date(row.fecha).getDate() + "-" + (new Date(row.fecha).getMonth() + 1) + "-" + new Date(row.fecha).getFullYear(),
                                    id_answer: row.id_respuesta,
                                    img_user: row.img,
                                    nombre_user: row.nombre_user,
                                    texto: row.answer_texto,
                                    v_negativo: row.v_negativo,
                                    v_positivo: row.v_positivo
                                }
                                answers.push(a);
                            });
                            callback(null, answers);
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
                connection.query("SELECT * FROM join_user_answer_votes WHERE join_user_answer_votes_correo_user = ? AND join_user_answer_votes_id_respuesta = ?", [data.correo_user, data.id_a],
                    function(err, vote) {
                        if (err) {
                            callback(new Error("Error al acceder a join_user_question_votes"));
                        } else {
                            if (vote.length == 0) {
                                connection.query("INSERT INTO join_user_answer_votes (join_user_answer_votes_correo_user,join_user_answer_votes_id_respuesta) VALUES (?,?)", [data.correo_user, data.id_a],
                                    function(err, result) {
                                        if (err) {
                                            callback(new Error("Error al insertar en join_user_question_votes"));
                                        } else {
                                            if (data.vote == "like") {
                                                connection.query("UPDATE answer SET v_positivo = v_positivo + 1, answer_puntos = answer_puntos + 1 WHERE answer.id_respuesta = ?", [data.id_a],
                                                    function(err, result2) {
                                                        connection.release();
                                                        if (err) {
                                                            callback(new Error("Error al actualizar la tabla question"));
                                                        } else {
                                                            callback(null, true);
                                                        }
                                                    });
                                            } else {
                                                connection.query("UPDATE answer SET v_negativo = v_negativo + 1, answer_puntos = answer_puntos - 1 WHERE answer.id_respuesta = ?", [data.id_a],
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

module.exports = modelAnswer;