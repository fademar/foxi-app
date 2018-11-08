'use strict';

class Passenger {
    constructor(type, age) {
        this.type = type;
        this.age = age;
    }
}

class Train {
    constructor(departureTime, departureStation, arrivalTime, type, number, passengers) 
    {
        this.departureTime = departureTime;
        this.departureStation = departureStation;
        this.arrivalTime = arrivalTime;
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

class Price {
    constructor(value)
    {
        this.value = value;
    }
} 

class Result {
    constructor(status, result)
    {
        this.status = status;
        this.result = result;
    }
}