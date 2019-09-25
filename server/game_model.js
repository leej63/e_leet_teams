const mongoose = require('mongoose');
// Unique Validator package, potential p2/3
// const uniqueValidator = require('mongoose-unique-validator')

mongoose.connect('mongodb://localhost/e_leet_teams_db',
    {useNewUrlParser: true}
);

var GameSchema = mongoose.Schema({
    questions: [],
}, {timestamps: true}
);

// UserSchema.plugin(uniqueValidator, { message: 'Restaurant already listed!' })

var Game = mongoose.model('Game', GameSchema);

module.exports = Game;