const Game = require('./game_model.js');
const Question = require('./question_model.js');
const  request = require('request');

module.exports = {
    generate_questions: (req, res)=>{
        if (req.params.id == "eleetteamsadmin"){
            Question.find()
                .then((data)=>{
                    if (data.length > 0){
                        var express_resposne = {
                            'message': "We already have a list"
                        }
                        res.json(express_response)
                    } else {
                        Question.create(
                            {name: "Two Sum",
                            full_prompt: "Given an array of integers, return indices of the two numbers such that they add up to a specific target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
                            starting_code: "def twoSum(nums, target):",
                            input: "\nprint(twoSum([2,7,11,15], 9), end ='')", 
                            expected_output: '[0, 1]',   
                            }
                        )
                            .then(data => console.log(data))
                            .catch(err=> console.log(err))
                        
                        Question.create({
                            name: "Find Sum",
                            full_prompt: "Given two integers, return sum of two integers",
                            starting_code: "def sum(num1, num2):",
                            input: "\nprint(sum(1,1), end='')",
                            expected_output: '2',
                        })
                            .then(data => console.log(data))
                            .catch(err=> console.log(err))
                        Question.create({
                            name: "Find Roman",
                            full_prompt: "Given a string that happens to be a roman numeral, convert it to an integer. Input is guaranteed to be within the range from 1 to 3999. Please return an integer or it will not run.",
                            starting_code: "def romanToInt(string):",
                            input: "\nprint(romanToInt('LIV'), end='')",
                            expected_output: '54',
                        })
                    }
                })
                .catch((err)=>res.json(err))
            }
    },
    find_questions: (req, res)=>{
        Question.find()
            .then(data => res.json(data))
            .catch(err => res.json(err))
    },
    create_game: (req, res)=>{
        var list_of_questions = [];

        // generate();

        Question.find()
            .then((data)=>{
                list_of_questions = data;

                Game.create(
                    {
                        questions: list_of_questions,
                        turns: 0,
                    },
                    //req.body.users MUST be a list of objects with the property 'name'
                )
                    .then((data)=>{
                        res.json(data)
                        console.log("Game created with these questions: ", data['questions'])
                    })
                    .catch((err)=>{
                        res.json(err)
                        console.log("There was an error with create a game instance")
                    })
            })
            .catch((err)=>{
                console.log("There was an error with generating list of questions");
            })
    },
    check_code: (req, res)=>{

        var program = {
            //Remember to replace
            script: req.body.script,
            language: "python3",
            versionIndex: 0,
            clientId: "d124c25a534e1781ceb5c8e4a7587d60", //Our jsdoodle client id
            clientSecret: "83b142b854a815ddb5ee7830b8a0dff7296358b84645e8f4ab352eb4e3a18c19", //Our jdoodle client seceret
        }

        var current_question = {}
        Question.findOne({name: req.body.question_name})
            .then((data)=>{
                current_question = data
                program.script += current_question.input

                request({
                    url:'https://api.jdoodle.com/v1/execute',
                    method: "POST",
                    json: program
                },
                function (error, response, body) {
        
                    var express_response = {
                        jdoodle: {},
                        game: {},
                    }
        
                    if (body.statusCode == 200){
                        if (body.output == current_question.expected_output){
                            body.message = "Correct!"
                            express_response.jdoodle = body

                            Game.updateOne({_id: req.body.game_id}, {$inc: {turns: 1}})
                            .then(data => {
                                Game.findOne({_id: req.body.game_id})
                                    .then((data)=>{
                                        express_response.game = data
                                        if (data.turns > 3){
                                            express_response.game.message = "No more submissions left!"
                                            res.json(express_response)
                                        } else {
                                            express_response.game.message = "Keep going!"
                                            res.json(express_response)
                                        }
                                    })
                                    .catch((err)=>{
                                        console.log("For some reason couldn't find the updated game...")
                                        res.json(err)
                                    })
                            })
                            .catch((err)=> {
                                console.log("Error at check_code > Question.findOne > Game.updateOne", err)
                                res.json(err)
                            })
                        }
                        else {
                            body.message = "Incorrect!"
                            express_response.jdoodle = body
                            Game.updateOne({_id: req.body.game_id}, {$inc: {turns: 1}})
                            .then(data => {
                                Game.findOne({_id: req.body.game_id})
                                    .then((data)=>{
                                        express_response.game = data
                                        if (data.turns > 3){
                                            express_response.game.message = "No more submissions left!"
                                            res.json(express_response)
                                        } else {
                                            express_response.game.message = "Keep going!"
                                            res.json(express_response)
                                        }
                                    })
                                    .catch((err)=>{
                                        res.json(err)
                                    })
                            })
                            .catch((err)=> {
                                console.log("Error at check_code > Question.findOne > Game.updateOne", err)
                                res.json(err)
                            })
                        }   
                    }
                })
            })
            .catch(err => res.json(err))

        ///temporary. When Question is ready, replace 'question' with 'current_question'
        // program.script += question.input
        
            // example json response to Angular Application below:
            // {
            //     "output": "0",
            //     "statusCode": 200,
            //     "memory": "5284",
            //     "cpuTime": "0.03",
            //     "message": "Incorrect!"
            // }

        // })
    }
}

// Example solution for Two Sum Question
// def twoSum(nums, target):
//     dict = {}
//     for i in range(len(nums)):
//         if target-nums[i] not in dict:
//             dict[nums[i]]=i
//         else:
//             return [dict[target-nums[i]],i]

// Sample JDoole Reponse for incorrect code
// { output:
//     '\nTraceback (most recent call last):\n  File "jdoodle.py", line 8, in <module>\n    print(twoSum([2,7,11,15], 9), end =\'\')\n  File "jdoodle.py", line 3, in twoSum\n    for i in ragne(len(nums)):\nNameError: name \'ragne\' is not defined\n',
//    statusCode: 200,
//    memory: '5284',
//    cpuTime: '0.02',
//    message: 'Incorrect!' } <-- added by our Express Server

// Sample JDoodle Reponse for valid code and correct output
// { output: '[0, 1]',
//   statusCode: 200,
//   memory: '5272',
//   cpuTime: '0.02',
//   message: 'Correct!' } <-- added by our Express Server

// Sample JDoodle Reponse for valid code but incorrect output
// { output: '[0, 100000]',
//   statusCode: 200,
//   memory: '5276',
//   cpuTime: '0.03',
//   message: 'Incorrect!' } <-- added by our Express Server