"user strict";


class modelUsuario {

    constructor(pool) {
        this.pool = pool;
    }



    getAllUsers(callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM user",
                    function(err, users) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos user"));
                        } else {
                            if (users.length === 0) {
                                callback(null, false); //no está el usuario con el password proporcionado
                            } else {
                                callback(null, users);
                            }
                        }
                    });
            }
        });
    }
    isUserCorrect(email, password, callback) {

        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM user WHERE email = ? AND password = ?", [email, password],
                    function(err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos user"));
                        } else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el password proporcionado
                            } else {
                                callback(null, rows);
                            }
                        }
                    });
            }
        });
    }
    signup(data_user, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) { // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos."));
            } else { // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query("SELECT * FROM user WHERE email = ? OR nombre_user = ?;", [data_user.email, data_user.userName],
                    function(err, existe) {
                        if (err) { // Si hay algún error se muestra un mensaje
                            callback(new Error("Error en la base de datos." + err));
                        } else {
                            if (existe.length > 0) {
                                // El usuario existe
                                connection.release();
                                callback(new Error("Correo o nombre de usuario ya existente"))
                            } else {
                                // El usuario no existe entonces se inserta
                                connection.query("INSERT INTO user (email, password,img, nombre_user) VALUES (?,?,?,?);", [data_user.email, data_user.password, data_user.imagen, data_user.userName],
                                    function(err, result) {
                                        connection.release(); // Liberamos la conexion
                                        if (err) {
                                            callback(null, false);
                                        } else {
                                            callback(null, true) // Se devuelve el resultado
                                        }
                                    });
                            }
                        }
                    });
            }
        });
    }

    updateReputacion(data, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                if (data.vote == "like") {
                    connection.query("UPDATE user SET reputacion = reputacion + 10 WHERE email = ?", [data.email],
                        function(err, result) {
                            connection.release();
                            if (err) {
                                callback(new Error("Error al actualizar la reputación de user"));
                            } else {
                                callback(null, true);
                            }
                        })
                } else {
                    connection.query("SELECT reputacion FROM user WHERE email = ?", [data.email],
                        function(err, reputacion) {
                            if (err) {
                                connection.release();
                                callback(new Error("Error al selecionar la reputación de user"));
                            } else {
                                if (reputacion[0].reputacion > 2) {
                                    connection.query("UPDATE user SET reputacion = reputacion - 2 WHERE email = ?", [data.email],
                                        function(err, result) {
                                            connection.release();
                                            if (err) {
                                                callback(new Error("Error al actualizar la reputación de user"));
                                            } else {
                                                callback(null, true);
                                            }
                                        })
                                } else if (reputacion[0].reputacion == 2) {
                                    connection.query("UPDATE user SET reputacion = 1 WHERE email = ?", [data.email],
                                        function(err, result) {
                                            connection.release();
                                            if (err) {
                                                callback(new Error("Error al actualizar la reputación de user"));
                                            } else {
                                                callback(null, true);
                                            }
                                        })
                                } else {
                                    connection.release();
                                    callback(null, true);
                                }
                            }
                        })
                }
            }
        })
    }


    addMedalAnswer(data, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT answer_puntos FROM answer WHERE id_respuesta = ?", [data.id_a],
                    function(err, puntos) {
                        if (err) {
                            callback(new Error("Error al selecionar los puntos de la respuesta"));
                        } else {
                            let ok = false;
                            let nombre, metal;
                            if (puntos[0].answer_puntos == 2) {
                                ok = true;
                                nombre = "Respuesta interesante";
                                metal = "bronce";
                            } else if (puntos[0].answer_puntos == 4) {
                                ok = true;
                                nombre = "Buena respuesta";
                                metal = "plata";
                            } else if (puntos[0].answer_puntos == 6) {
                                ok = true;
                                nombre = "Excelente respuesta";
                                metal = "oro";
                            }

                            if (ok) {
                                connection.query("SELECT * FROM medallas_user_answer WHERE medallas_answer_correo_user = ? AND medallas_answer_id_respuesta = ? AND medallas_nombre = ?", [data.email, data.id_a, nombre],
                                    function(err, medalla) {
                                        if (err) {
                                            callback(new Error("Error al selecionar la medalla en la base de datos"));
                                        }
                                        if (medalla.length > 0) {
                                            connection.release();
                                            callback(null, false);
                                        } else {
                                            connection.query("INSERT INTO medallas_user_answer (medallas_answer_correo_user,medallas_answer_id_respuesta,medallas_nombre, medallas_metal) VALUES (?,?, ?,?)", [data.email, data.id_a, nombre, metal],
                                                function(err, result) {
                                                    connection.release();
                                                    if (err) {
                                                        callback(new Error("Error al meter la medalla en la base de datos"));
                                                    } else {
                                                        callback(null, true);
                                                    }
                                                })
                                        }
                                    })
                            } else {
                                connection.release();
                                callback(null, false)
                            }
                        }
                    })
            }
        })
    }

    addMedalQuestion(data, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT question_puntos FROM question WHERE id_pregunta = ?", [data.id],
                    function(err, puntos) {
                        if (err) {
                            callback(new Error("Error al selecionar los puntos de la respuesta"));
                        } else {
                            let ok = false;
                            let nombre, metal;
                            if (puntos[0].question_puntos == 1) {
                                ok = true;
                                nombre = "Estudiante";
                                metal = "bronce";
                            } else if (puntos[0].question_puntos == 2) {
                                ok = true;
                                nombre = "Pregunta interesante";
                                metal = "bronce";
                            } else if (puntos[0].question_puntos == 4) {
                                ok = true;
                                nombre = "Buena pregunta";
                                metal = "plata";
                            } else if (puntos[0].question_puntos == 6) {
                                ok = true;
                                nombre = "Excelente pregunta";
                                metal = "oro";
                            }

                            if (ok) {
                                connection.query("SELECT * FROM medallas_user_question WHERE medallas_question_correo_user = ? AND medallas_question_id_pregunta = ? AND medallas_nombre = ?", [data.email, data.id, nombre],
                                    function(err, medalla) {
                                        if (err) {
                                            callback(new Error("Error al selecionar la medalla en la base de datos"));
                                        }
                                        if (medalla.length > 0) {
                                            connection.release();
                                            callback(null, false);
                                        } else {
                                            connection.query("INSERT INTO medallas_user_question (medallas_question_correo_user,medallas_question_id_pregunta,medallas_nombre, medallas_metal) VALUES (?,?, ?,?)", [data.email, data.id, nombre, metal],
                                                function(err, result) {
                                                    connection.release();
                                                    if (err) {
                                                        callback(new Error("Error al meter la medalla en la base de datos"));
                                                    } else {
                                                        callback(null, true);
                                                    }
                                                })
                                        }
                                    })
                            } else {
                                connection.release();
                                callback(null, false)
                            }
                        }
                    })
            }
        })
    }



    addMedalVisit(data, callback) {

        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT visitas FROM question WHERE id_pregunta = ?", [data.id],
                    function(err, visitas) {
                        if (err) {
                            callback(new Error("Error al selecionar las visitas de la pregunta"));
                        } else {
                            let ok = false;
                            let nombre, metal;
                            if (visitas[0].visitas == 2) {
                                ok = true;
                                nombre = "Pregunta popular";
                                metal = "bronce";
                            } else if (visitas[0].visitas == 4) {
                                ok = true;
                                nombre = "Pregunta destacada";
                                metal = "plata";
                            } else if (visitas[0].visitas == 6) {
                                ok = true;
                                nombre = "Pregunta famosa";
                                metal = "oro";
                            }

                            if (ok) {
                                connection.query("SELECT email FROM user WHERE nombre_user =?", [data.name],
                                    function(err, email) {
                                        if (err) {
                                            callback(new Error("Error al selecionar la medalla en la base de datos"))
                                        } else {
                                            connection.query("SELECT * FROM medallas_user_visit WHERE medallas_visit_correo_user = ? AND medallas_visit_id_pregunta = ? AND medallas_nombre = ?", [email[0].email, data.id, nombre],
                                                function(err, medalla) {
                                                    if (err) {
                                                        callback(new Error("Error al selecionar la medalla en la base de datos"));
                                                    }
                                                    if (medalla.length > 0) {
                                                        connection.release();
                                                        callback(null, false);
                                                    } else {
                                                        connection.query("INSERT INTO medallas_user_visit (medallas_visit_correo_user,medallas_visit_id_pregunta,medallas_nombre, medallas_metal) VALUES (?,?, ?,?)", [email[0].email, data.id, nombre, metal],
                                                            function(err, result) {
                                                                connection.release();
                                                                if (err) {
                                                                    callback(new Error("Error al meter la medalla en la base de datos"));
                                                                } else {
                                                                    callback(null, true);
                                                                }
                                                            })
                                                    }
                                                })
                                        }

                                    })

                            } else {
                                connection.release();
                                callback(null, false)
                            }
                        }
                    })
            }
        })

    }

    getAllUsers(callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM user LEFT JOIN question ON question.correo_user = user.email LEFT JOIN tags ON question.id_pregunta = tags.id_p",
                    function(err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de conexión a la base de datos"));
                        } else {
                            let users = [];
                            let u;
                            result.forEach(row => {
                                if (users.find(user => user.email == row.email) != null) {
                                    if (row.nombre != null) {
                                        users[users.indexOf(users.find(user => user.email == row.email))].tags.push(row.nombre);
                                    }
                                } else {
                                    u = {
                                        email: row.email,
                                        nombre: row.nombre_user,
                                        img: row.img,
                                        reputacion: row.reputacion,
                                        tags: [row.nombre]
                                    }
                                    users.push(u);
                                }
                            });
                            users.forEach(user => {
                                let max = user.tags.sort((a, b) =>
                                    user.tags.filter(v => v === a).length -
                                    user.tags.filter(v => v === b).length).pop();
                                user.max = max;
                            })
                            callback(null, users);
                        }
                    })
            }
        })
    }

    searchUsers(busqueda, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM user LEFT JOIN question ON question.correo_user = user.email LEFT JOIN tags ON question.id_pregunta = tags.id_p WHERE user.nombre_user LIKE ?", ["%" + busqueda + "%"],
                    function(err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de conexión a la base de datos"));
                        } else {
                            let users = [];
                            let u;
                            result.forEach(row => {
                                if (users.find(user => user.email == row.email) != null) {
                                    if (row.nombre != null) {
                                        users[users.indexOf(users.find(user => user.email == row.email))].tags.push(row.nombre);
                                    }
                                } else {
                                    u = {
                                        email: row.email,
                                        nombre: row.nombre_user,
                                        img: row.img,
                                        reputacion: row.reputacion,
                                        tags: [row.nombre]
                                    }
                                    users.push(u);
                                }
                            });
                            users.forEach(user => {
                                let max = user.tags.sort((a, b) =>
                                    user.tags.filter(v => v === a).length -
                                    user.tags.filter(v => v === b).length).pop();
                                user.max = max;
                            })
                            callback(null, users);
                        }
                    })
            }
        })
    }

    getUserInfo(nombre, callback) {

        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                let respuestas = "SELECT * FROM user LEFT JOIN medallas_user_answer ON user.email = medallas_user_answer.medallas_answer_correo_user WHERE user.nombre_user = ?";
                let preguntas = "SELECT * FROM user LEFT JOIN medallas_user_question ON user.email = medallas_user_question.medallas_question_correo_user WHERE user.nombre_user = ?"
                let visitas = "SELECT * FROM user LEFT JOIN medallas_user_visit ON user.email = medallas_user_visit.medallas_visit_correo_user WHERE user.nombre_user = ?";
                connection.query(respuestas, [nombre], function(err, respuestas) {
                    if (err) {
                        callback(new Error("Error al coger la información de un usuario"));
                    } else {
                        connection.query(preguntas, [nombre], function(err, preguntas) {
                            if (err) {
                                callback(new Error("Error al coger la información de un usuario"));
                            } else {
                                connection.query(visitas, [nombre], function(err, visitas) {
                                    connection.release();
                                    if (err) {
                                        callback(new Error("Error al coger la información de un usuario"));
                                    } else {
                                        let user = {
                                            email: respuestas[0].email,
                                            nombre: respuestas[0].nombre_user,
                                            img: respuestas[0].img,
                                            fecha: new Date(respuestas[0].fecha_alta).getDate() + "-" + (new Date(respuestas[0].fecha_alta).getMonth() + 1) + "-" + new Date(respuestas[0].fecha_alta).getFullYear(),
                                            reputacion: respuestas[0].reputacion,
                                            preguntas: respuestas[0].preguntas,
                                            respuestas: respuestas[0].respuestas,
                                            bronce: [],
                                            medallasBronce: 0,
                                            plata: [],
                                            medallasPlata: 0,
                                            oro: [],
                                            medallasOro: 0
                                        }
                                        let medallas = [];
                                        respuestas.forEach(res => medallas.push(res));
                                        preguntas.forEach(pre => medallas.push(pre));
                                        visitas.forEach(vi => medallas.push(vi));
                                        medallas.forEach(medalla => {
                                            if (medalla.medallas_metal == "bronce") {
                                                if (user.bronce.find(medal => medal.nombre == medalla.medallas_nombre) != null) {
                                                    user.bronce[user.bronce.indexOf(user.bronce.find(medal => medal.nombre == medalla.medallas_nombre))].num++;
                                                } else {
                                                    user.bronce.push({ nombre: medalla.medallas_nombre, num: 1 });
                                                }
                                                user.medallasBronce++;
                                            }
                                            if (medalla.medallas_metal == "plata") {
                                                if (user.plata.find(medal => medal.nombre == medalla.medallas_nombre) != null) {
                                                    user.plata[user.plata.indexOf(user.plata.find(medal => medal.nombre == medalla.medallas_nombre))].num++;
                                                } else {
                                                    user.plata.push({ nombre: medalla.medallas_nombre, num: 1 });
                                                }
                                                user.medallasPlata++;
                                            }
                                            if (medalla.medallas_metal == "oro") {
                                                if (user.oro.find(medal => medal.nombre == medalla.medallas_nombre) != null) {
                                                    user.oro[user.oro.indexOf(user.oro.find(medal => medal.nombre == medalla.medallas_nombre))].num++;
                                                } else {
                                                    user.oro.push({ nombre: medalla.medallas_nombre, num: 1 });
                                                }
                                                user.medallasOro++;
                                            }

                                        })

                                        callback(null, user);

                                    }
                                })
                            }
                        })

                    }
                })
            }
        })

    }


    getMessages(email, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM messages JOIN user ON messages.email_send = user.email WHERE messages.email_user = ? ORDER BY fecha DESC", [email],
                    function(err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de conexión a la tabla de messages"));
                        } else {
                            let messagesFinal = [];
                            let m;
                            result.forEach(row => {
                                m = {
                                    id: row.id,
                                    img: row.img,
                                    nombre: row.nombre_user,
                                    email: row.email,
                                    texto: row.texto,
                                    fecha: new Date(row.fecha).getDate() + "-" + (new Date(row.fecha).getMonth() + 1) + "-" + new Date(row.fecha).getFullYear(),
                                    hora: new Date(row.fecha).getHours() + ":" + (new Date(row.fecha).getMinutes()) + ":" + new Date(row.fecha).getSeconds(),
                                }
                                messagesFinal.push(m)
                            });
                            callback(null, messagesFinal);
                        }
                    })
            }
        })
    }



    deleteMessage(id, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("DELETE  FROM messages WHERE id = ?", [id],
                    function(err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de conexión a la tabla de messages"));
                        } else {
                            callback(null, true);
                        }
                    })
            }
        })
    }
    getUserMessages(email, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT * FROM user WHERE user.email != ? ORDER BY user.nombre_user ASC", [email],
                    function(err, result) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error de conexión a la tabla de messages"));
                        } else {
                            let users = [];
                            let m;
                            result.forEach(row => {
                                m = {
                                    img: row.img,
                                    nombre: row.nombre_user,
                                    email: row.email,
                                }
                                users.push(m)
                            });
                            callback(null, users);
                        }
                    })
            }
        })
    }


    sendMessages(data, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT email FROM user WHERE user.nombre_user = ?", [data.nombre],
                    function(err, result) {
                        if (err) {
                            callback(new Error("Error de conexión a la tabla de messages"));
                        } else {
                            connection.query("INSERT INTO messages (email_send,email_user,texto) VALUES (?,?,?)", [result[0].email, data.email, data.texto],
                                function(err, ok) {
                                    if (err) {
                                        callback(new Error("Error de conexión a la tabla de messages"));
                                    } else {
                                        callback(null, true);
                                    }
                                })
                        }
                    })
            }
        })
    }
}



module.exports = modelUsuario;