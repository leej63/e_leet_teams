const controller = require('./controller.js');

module.exports = (app)=>{
    app.get('/questions', controller.find_questions)
    app.post('/questions', controller.create_question)
    app.post('/game', controller.create_game)
    app.post('/game/check', controller.check_code)
    // app.put('/game', controller.new_question)
    app.all("*", controller.reroute)
}