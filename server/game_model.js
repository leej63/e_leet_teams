const mongoose = require('mongoose');
// Unique Validator package, potential p2/3
// const uniqueValidator = require('mongoose-unique-validator')

mongoose.connect('mongodb://localhost/e_leet_teams_db',
    {useNewUrlParser: true}
);


var UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "Name is required"],
        minlength: [3, "Name must be 3 or more characters"],
        // unique: true
    },
    score: {
        type: Number,
        default: 0,
        require: true
    }
});

var GameSchema = mongoose.Schema({
    questions: [],
    users: [UserSchema],
}, {timestamps: true}
);

// UserSchema.plugin(uniqueValidator, { message: 'Restaurant already listed!' })

var Game = mongoose.model('Game', GameSchema);

module.exports = Game;