const controller = require('./controller.js');
const path = require('path');

module.exports = (app)=>{
    app.post('/game', controller.create_game)
    app.post('/game/check', controller.check_code)
    // app.put('/game', controller.new_question)
    app.all("*", controller.reroute)
}