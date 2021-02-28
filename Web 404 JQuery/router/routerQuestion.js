"use strict"
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

//Controladores
const controllerQuestion = require("../controller/controllerQuestion");
const controllerUser = require("../controller/controllerUser")


//GET
router.get("/", controllerUser.checkUser, controllerQuestion.allQuestions);

router.get("/newQuestion", controllerUser.checkUser, controllerQuestion.newQuestion);

router.get("/infoQuestion/:id/:name", controllerUser.checkUser, controllerQuestion.infoQuestion);

router.get("/withoutAnswers", controllerUser.checkUser, controllerQuestion.withoutAnswers);



//POST
router.post("/addNewQuestion", controllerUser.checkUser, controllerQuestion.addNewQuestion);

router.post("/searchQuestionByString", controllerUser.checkUser, controllerQuestion.searchQuestionByString);

router.post("/searchQuestionByTags", controllerUser.checkUser, controllerQuestion.searchQuestionByTags);

router.post("/addNewAnswer/:id", controllerUser.checkUser, controllerQuestion.addNewAnswer);

router.post("/updateVotesQuestion/:id/:emailQuestion", controllerUser.checkUser, controllerQuestion.updateVotesQuestion);

router.post("/updateVotesAnswer/:id_q/:id_a/:emailQuestion", controllerUser.checkUser, controllerQuestion.updateVotesAnswer);







//export
module.exports = router;