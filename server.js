'use strict';

const express = require('express');
const fs = require('fs');
const port = 3000;
const bodyparser = require('body-parser');
const path = require('path');
const cheerio = require('cheerio');
const Classes = require('./classes');

// Init express app
const app = express();
app.use(bodyparser.json());


// express Sendfile Option
const OPTIONS = {
    root: __dirname + '/public/assets/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
};

// Read the html file
const html = fs.readFileSync(__dirname + '/public/assets/test.html', 'utf8');

// Clean the html code
const cleanHtml = html.replace(/(?:\\[rn]|[\r\n]+)+/g, '').replace(/\\"/gm,'"').replace(/\s\s+/g, ' ');

// Setup Cheerio
const $ = cheerio.load(cleanHtml);


function assignData() {
    
}

// Cross-Origin Handlers
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Point static path to dist directory for angular
app.use(express.static(path.join(__dirname, 'public')));

//Init server
app.listen(port);


// Send html file
app.get('/api/file', (req, res) => {
    res.status(200).send(cleanHtml);
});



app.get('*',  (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
