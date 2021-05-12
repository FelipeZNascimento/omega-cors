const express = require('express'),
    app = express(),
    cors = require('cors'),
    port = process.env.PORT || 8081;

app.options('*', cors());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port);

console.log('API server started on: ' + port);

var routes = require('./app/routes/appRoutes'); //importing route
routes(app); //register the route