export class Passenger {
    constructor(
        public type: string,
        public age: string
    ) {}
}

export class Train {
    constructor(
        public departureTime: string,
        public departureStation: string,
        public arrivalTime: string,
        public type: string,
        public number: number,
        public passengers?: Array<Passenger>
    ) {}
}

export class RoundTrip {
    constructor (
        public type: string,
        public date: Date,
        public trains: Array<Train>
    ) {}
}

export class Trip {
    constructor(
        public code: string,
        public name: string,
        public details: {price: number, roundtrips: Array<RoundTrip>},
    ) {}
}

export class Price {
    constructor(
        public value: number
    ) {}
} 

export class Result {
    constructor(
        public status: string,
        public result: {trips: Array<Trip>, custom: {prices: Array<Price>}}
    ) {}
}