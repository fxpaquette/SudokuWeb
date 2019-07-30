import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class NumbersOCRService {

  constructor(private httpClient :HttpClient) {  
  }
  getData(){
    let result = "";
    this.httpClient.get("../../assets/param_neural_net/test.txt",{responseType: 'text'})
    .subscribe(data => {result = data;console.log(data);});
    return result;
  }
}
