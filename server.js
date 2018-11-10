'use strict';

const express = require('express');
const fs = require('fs');
const port = 3000;
const bodyparser = require('body-parser');
const path = require('path');
const cheerio = require('cheerio');
const moment = require('moment');
const Classes = require('./classes');

moment.locale('fr');

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
  
  try {
    // Read the html file
    const html = await fs.readFileSync(__dirname + '/dist/assets/test.html', 'utf8');

    // Clean the html code
    const cleanHtml = await html.replace(/(?:\\[rn]|[\r\n]+)+/g, '').replace(/\\"/gm, '"').replace(/\s\s+/g, ' ');

    // Init Cheerio
    const $ = await cheerio.load(cleanHtml);

    // Total Price in Details
    let totalPrice = $('.very-important', '.total-amount').text();
    totalPrice = totalPrice.replace(/,/, '.');
    totalPrice = parseFloat(totalPrice);
    const Details = new Classes.Details;
    Details.price = totalPrice;
    Details.roundtrips = [];

    // Get the reference of the trip
    const Trip = new Classes.Trip;
    const referenceDossier = $('.pnr-ref').find($('.pnr-info')).last().text().trim();
    Trip.code = referenceDossier;
    const name = $('.pnr-name').find($('.pnr-info')).last().text().trim();
    Trip.name = name;
    Trip.details = Details;

    // Get the full dates of travel
    const regexDate = new RegExp(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/, 'g');
    const pnrSummary = $('.pnr-summary').text();
    const arrayDates = [];
    let match;

    while ((match = regexDate.exec(pnrSummary)) !== null) {
      arrayDates.push(match[0]);
    }    

    $('.product-details').each(function (i, elem) {
      const Roundtrip = new Classes.RoundTrip;
      const typeJourney = $(this).find($('.travel-way')).text().trim();
      Roundtrip.type = typeJourney;
      const date = moment(arrayDates[i], 'DD/MM/YYYY', 'fr', true);
      Roundtrip.date = date;

      // Retrieve train specifications
      Roundtrip.trains = [];
      const Train = new Classes.Train;
      const departureTime = $(this).find($('.origin-destination-hour.segment-departure')).text().trim();
      Train.departureTime = departureTime.replace(/h/gi, ':');
      const departureStation = $(this).find($('.origin-destination-station.segment-departure')).text().trim();
      Train.departureStation = departureStation;
      const arrivalTime = $(this).find($('.origin-destination-hour.segment-arrival')).text().trim();
      Train.arrivalTime = arrivalTime.replace(/h/gi, ':');
      const arrivalStation = $(this).find($('.origin-destination-station.segment-arrival')).text().trim();
      Train.arrivalStation = arrivalStation;
      const typeTrain = $(this).find($('.segment')).text().replace(/[0-9]/gi, '').trim();
      Train.type = typeTrain;
      const numberTrain = $(this).find($('.segment')).text().replace(/[a-zA-Z]/gi, '').trim();
      Train.number = numberTrain;

      // Retrieve Passengers for each train
      Train.passengers = [];
      $(this).next($('.passengers')).find($('.typology')).each(function (i, elem) {
        const Passenger = new Classes.Passenger;
        const regexAge = /\((.*?)\)/;
        const passengerAge = regexAge.exec($(this).text())[0];
        Passenger.age = passengerAge;

        if (($(this).next($('.fare-details')).text()).indexOf('Billet échangeable et remboursable') !== -1) {
          Passenger.type = 'échangeable';
        } else {
          Passenger.type = 'non-échangeable';
        };

        Train.passengers.push(Passenger);
      });

      Roundtrip.trains.push(Train);

      Details.roundtrips.push(Roundtrip);
    });

    // Get customs
    const Custom = new Classes.Custom;
    Custom.prices = [];
    $('.product-header').each(function (i,elem){
      const Price = new Classes.Price;
      let customPrice = $(this).find($('td')).last().text().replace(/,/, '.');
      customPrice = parseFloat(customPrice);
      Price.value = customPrice;
      Custom.prices.push(Price.value);
    });

    const Result = new Classes.Result;
    Result.trips = [];
    Result.trips.push(Trip);
    Result.custom = Custom;

    const Json = new Classes.Json;
    Json.status = 'ok';
    Json.result = Result;

    return Json;
  }
  catch(e) {
    console.log(e);
  }
}


// Send html file
app.get('/api/file', (req, res) => {

    processData().then(data => res.status(200).send(data))

});



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});
