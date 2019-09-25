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

                Game.create(
                    {questions: list_of_questions},
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

        //enable when you need to create one question
        // generate();

        var current_question = {}
        Question.findOne({name: req.body.question_name})
            .then((data)=>{
                current_question = data
                console.log("found question!", data)
                program.script += current_question.input
                console.log("Program script is :", program.script)

                // request({
                //     url:'https://api.jdoodle.com/v1/execute',
                //     method: "POST",
                //     json: program
                // },
                // function (error, response, body) {
        
        
                //     if (body.statusCode == 200){
                //         if (body.output == current_question.expected_output){
                //             body.message = "Correct!"
                //             console.log('body:', body)
                //             res.json(body)
                //         }
                //         else {
                //             body.message = "Incorrect!"
                //             console.log('body:', body)
                //             res.json(body)
                //         }
                //     }
                // })
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

function generate(){
    console.log("we are creating")

    Question.create(
        {name: "Two Sum",
        full_prompt: "Given an array of integers, return indices of the two numbers such that they add up to a specific target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        starting_code: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:",
        input: "\nprint(twoSum([2,7,11,15], 9), end ='')", 
        expected_output: '[0, 1]',   
        }
    )
        .then(data => console.log(data));
}

// Workable Solution for TwoSum Python3
// {
// 	"script": "def twoSum(nums, target):\n    dict = {}\n    for i in range(len(nums)):\n        if target-nums[i] not in dict:\n            dict[nums[i]]=i\n        else:\n            return [dict[target-nums[i]],i]",
// 	"question_name": "Two Sum"
// }