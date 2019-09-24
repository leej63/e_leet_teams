const Game = require('./game_model.js');
const Question = require('./question_model.js');
const  request = require('request');

module.exports = {
    find_questions: (req, res)=>{
        Question.find()
            .then(data => res.json(data))
            .catch(err => res.json(err))
    },
    create_question: (req, res)=>{
        Question.create(req.body)
            .then(data => res.json(data))
            .catch(err => res.json(err))
    },
    create_game: (req, res)=>{
        var list_of_questions = [];

        Question.find()
            .then((data)=>{
                list_of_questions = data;
            })
            .catch((err)=>{
                console.log("There was an error with generating list of questions");
            })
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
    check_code: {
        console.log(req.body)

        //prepare JSON package for jdoodle
        var program = {
            script: req.body.script,
            language: "python3",
            versionIndex: 0,
            clientId: "d124c25a534e1781ceb5c8e4a7587d60", //Our jsdoodle client id
            clientSecret: "47f844070a802d9df4968bb2e8807b89b6d3e9c06bd467baf60f69dc925bad4a", //Our jdoodle client seceret
        }

        //Temporary question. Pull question id from req.body
        var question = {
            name: "Add Two",
            full_promt: 'In Python, please add two integers.',
            input: '\nprint(sum(2, 2))',
            expected_output: 4,
        }
        program.script += question.input
        console.log("the Script: ", program.script)

        request({
            url:'https://api.jdoodle.com/v1/execute',
            method: "POST",
            json: program
        },
        function (error, response, body) {
            console.log('error:', error)
            console.log('statusCode:', response && response.statusCode)
            console.log('body:', body)

            if (body.statusCode == 200){
                if (parseInt(body.output) == parseInt(question.expected_output)){
                    console.log('Your output matches the expected output!')
                    console.log('Your output: ', body.output)
                    console.log('Expected output: ', question.expected_output)
                }
                else {
                    console.log('Your output did not match the expected output!')
                    console.log('Your output: ', body.output)
                    console.log('Expected output: ', question.expected_output)
                }
            }
            res.json(body);
        })
    }
}