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


// Cross-Origin Handlers
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Point static path to dist directory for angular
app.use(express.static(path.join(__dirname, 'dist')));

// Init server
app.listen(port);

async function processData() {
    // Read the html file
    const html = await fs.readFileSync(__dirname + '/dist/assets/test.html', 'utf8');
    
    // Clean the html code
    const cleanHtml = await html.replace(/(?:\\[rn]|[\r\n]+)+/g, '').replace(/\\"/gm,'"').replace(/\s\s+/g, ' ');

    return cleanHtml;

}

// Send html file
app.get('/api/file', (req, res) => {  
    processData().then((data) => {
        res.status(200).send(data);
    });
});



app.get('*',  (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});
