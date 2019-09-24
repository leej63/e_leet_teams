const controller = require('./controller.js');
const path = require('path');

module.exports = function (app) {
    app.post('/game', (req, res) => { 
        controller.create_game(req, res);
    });
    app.post('/game/check', (req, res) => {
        controller.check_code(req, res);
    });
    // app.put('/game', controller.new_question)
    app.all("*", (req,res,next) => {
        console.log('hello!')
        res.sendFile(path.resolve("./public/dist/public/index.html"));
    });
}