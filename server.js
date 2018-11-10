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

    // Init Cheerio
    const $ = await cheerio.load(cleanHtml);

    // Total Price in Details
    let totalPrice = $('.very-important', '.total-amount').text();
    totalPrice = totalPrice.replace(/,/,'.');
    totalPrice = parseFloat(totalPrice);;
    const Details = new Classes.Details;
    Details.price = totalPrice;
    Details.roundtrips = [];
    const jsonDetails = JSON.stringify(Details);

    // Référence de dossier
    const Trip = new Classes.Trip;
    const referenceDossier = $('.pnr-ref').find($('.pnr-info')).last().text().trim();
    Trip.code = referenceDossier;
    const name = $('.pnr-name').find($('.pnr-info')).last().text().trim();
    Trip.name = name;
    Trip.details = Details;


    $('.product-details').each(function(i, elem) {
        const Roundtrip = new Classes.RoundTrip;
        const typeJourney = $(this).find($('.travel-way')).text().trim();
        Roundtrip.type = typeJourney;
        const date = $(this).prev().find($('.product-travel-date')).text().trim();
        Roundtrip.date = date;

        const Train = new Classes.Train;
        const departureTime = $(this).find($('.origin-destination-hour .segment-departure').text().trim());
        Train.departureTime = departureTime;
        const departureStation = $(this).find($('.origin-destination-station .segment-departure').text().trim());
        Train.departureStation = departureStation;
        const arrivalTime = $(this).find($('.origin-destination-hour .segment-arrival').text().trim());
        Train.arrivalTime = arrivalTime;
        const arrivalStation = $(this).find($('.origin-destination-station .segment-arrival').text().trim());
        Train.arrivalStation = arrivalStation;
        // const typeTrain = $(this).find($('.segment').text().replace(/\d/i, '').trim());
        // Train.type = typeTrain;
        const numberTrain = $(this).find($('.segment').text().replace(/\D/i, '').trim());
        console.log(numberTrain);
        // Train.number = numberTrain;
        Details.roundtrips.push(Roundtrip);
    });


    this.departureTime = departureTime;
    this.departureStation = departureStation;
    this.arrivalTime = arrivalTime;
    this.type = type;
    this.number = number;
    this.passengers = passengers;


    console.log(JSON.stringify(Trip));
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
