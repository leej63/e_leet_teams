const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/public/dist/public/'));

require('./server/routes.js')(app);

app.listen(4000, ()=> {
    console.log("ExpressJS Server listening on port 4000");
})