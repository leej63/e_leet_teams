const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/e_leet_teams_db',
    {useNewUrlParser: true}    
)

var QuestionSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    full_prompt: {
        type: String,
        require: true
    },
    input: {
        type: String,
        require: true
    },
    expected_output: {
        type: String,
        require: true
    }
});

var Question = mongoose.model('QuestionSchema', QuestionSchema);

module.exports = Question;