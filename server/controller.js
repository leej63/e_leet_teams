const Game = require('./game_model.js');
const Question = require('./question_model.js');
const  request = require('request');

const path = require('path');

module.exports = {
    reroute: (req, res)=>{
        console.log("User has been reqwreouted to '/' and Angular is served.")
        res.sendFile(path.resolve("./public/dist/public/index.html"))
    },
    create_game: (req, res)=>{
        var list_of_questions = [];

        Question.find() //currently grabbing all questions
            .then((data)=>{
                list_of_questions = data;
            })
            .catch((err)=>{
                console.log("There was an error with generating list of questions");
            })
        //req.body 
        Game.create(
            {questions: list_of_questions},
            {users: req.body.users}
        )
            .then((data)=>{
                res.json(data)
                console.log("Game created with with these users: ", data[users])
            })
            .catch((err)=>{
                res.json(err)
                console.log("There was an error with create a game instance")
            })
    },
    check_code: (req, res)=>{
        console.log(req.body)
        var program = {
            "script": req.body.script,
            "language": req.body.language,
            "versionIndex": req.body.version_index,
            "clientId": "d124c25a534e1781ceb5c8e4a7587d60", //Our jsdoodle client id
            "clientSecret": "91eb5db459fc36aa59e6f8b6e182394cd2b2f8470345724c92f901ce88152d77", //Our jdoodle client seceret
        }
        request({
            url:'https://api.jdoodle.com/v1/execute',
            method: "POST",
            json: program
        },
        function (error, response, body) {
            console.log('error:', error)
            console.log('statusCode:', response && response.statusCode)
            console.log('body:', body)
            res.json(response)
        })
    }
}