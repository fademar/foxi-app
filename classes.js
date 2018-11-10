'use strict';

class Passenger {
    constructor(type, age) {
        this.type = type;
        this.age = age;
    }
}

class Train {
    constructor(departureTime, departureStation, arrivalTime, arrivalStation, type, number, passengers) 
    {
        this.departureTime = departureTime;
        this.departureStation = departureStation;
        this.arrivalTime = arrivalTime;
        this.arrivalStation = arrivalStation;
        this.type = type;
        this.number = number;
        this.passengers = passengers;
    }
}

class RoundTrip {
    constructor (type,  date, trains)
    {
        this.type = type;
        this.date = date;
        this.trains = trains;
    }
}

class Trip {
    constructor(code, name, details)
    {
        this.code = code;
        this.name = name;
        this.details = details;
    }
}

class Details {
    constructor(price, roundtrips)
    {
        this.price = price;
        this.roundtrips = roundtrips; 
    }
}

class Price {
    constructor(value)
    {
        this.value = value;
    }
}

class Custom {
    constructor(prices) {
        this.prices = prices;
    }
}

class Result {
    constructor(trips, custom)
    {
        this.trips = trips;
        this.custom = custom;
    }
}

class Json {
    constructor(status, result)
    {
        this.status = status;
        this.result = result;
    }
}

module.exports = {
    Passenger : Passenger,
    Train : Train,
    RoundTrip : RoundTrip,
    Trip : Trip,
    Details : Details,
    Price : Price,
    Custom : Custom,
    Result : Result,
    Json : Json
  }