import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Passenger, Train, RoundTrip, Trip, Price, Result} from '../models/app-models';

@Injectable({
	providedIn: 'root'
})
export class FileService {


	constructor(private http: HttpClient) { }


    assignData(data) {
        const parser = new DOMParser();
        const document = parser.parseFromString(data, "text/html");
        console.log(document.getElementsByClassName('very-important')[0].textContent);
        return data;
    }



    getResult(): Observable<any> {
        return this.http.get('/api/file', {responseType: 'text'}).pipe(map((data) => this.assignData(data)));
    } 






}
