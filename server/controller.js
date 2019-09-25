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
            //req.body.users MUST be a list of objects with the property 'name'
            {users: req.body.users}
        )
            .then((data)=>{
                res.json(data)
                console.log("Game created with these users: ", data['users'])
            })
            .catch((err)=>{
                res.json(err)
                console.log("There was an error with create a game instance")
            })
    },
    check_code: (req, res)=>{
        //Replace with Post Man or req.body
        // var temporary_script = {
        //     "script": "def sum(num1, num2): return num1 + num2"
        // }

        var program = {
            //Remember to replace
            script: req.body.script,
            language: "python3",
            versionIndex: 0,
            clientId: "d124c25a534e1781ceb5c8e4a7587d60", //Our jsdoodle client id
            clientSecret: "83b142b854a815ddb5ee7830b8a0dff7296358b84645e8f4ab352eb4e3a18c19", //Our jdoodle client seceret
        }

        //Temporary question. Pull question id from req.body
        var question = {
            name: "Add Two",
            full_promt: 'In Python, please add two integers. Return Sum',
            input: '\nprint(sum(2, 2)).rstrip()',
            expected_output: 4,
        }

        // temporary disabled. Enable when Question from models is ready
        var current_question = {}
        Question.findOne({_id: req.params})
            .then((data)=>{
                current_question = data;
            })
            .catch(err => res.json(err))
        program.script += current_question.input

        ///temporary. When Question is ready, replace 'question' with 'current_question'
        program.script += question.input

        request({
            url:'https://api.jdoodle.com/v1/execute',
            method: "POST",
            json: program
        },
        function (error, response, body) {


            if (body.statusCode == 200){
                if (parseInt(body.output) == parseInt(question.expected_output)){
                    body.message = "Correct!"
                    console.log('body:', body)
                    res.json(body)
                }
                else {
                    body.message = "Incorrect!"
                    console.log('body:', body)
                    res.json(body)
                }
            }
            //example json response to Angular Application below:
            // {
            //     "output": "0\n",
            //     "statusCode": 200,
            //     "memory": "5284",
            //     "cpuTime": "0.03",
            //     "message": "Incorrect!"
            // }

        })
    },
    generate_questions: (req, res)=>{
        Question.create(
            {name: "Two Sum"},
            {full_prompt: "Given an array of integers, return indices of the two numbers such that they add up to a specific target. You may assume that each input would have exactly one solution, and you may not use the same element twice."},
            {input: '\nprint(twoSum([2,7,11,15], 9)'},
            {expected_output: '[0, 1]'}
        )
    }
}