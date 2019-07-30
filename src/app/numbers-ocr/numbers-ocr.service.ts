import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root'
})
export class NumbersOCRService {

  constructor(private httpClient :HttpClient) {  
  }
  getData(){
    return this.httpClient.get("../../assets/param_neural_net/neuralnet_saved_2.txt",{responseType: 'text'});
  }
}
