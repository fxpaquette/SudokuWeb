import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import * as nj from '../../../bower_components/numjs/dist/numjs.min.js';
import {NumbersOCRService} from './numbers-ocr.service';
//Foncion range similaire a celle de python
const range = ( a , b ) => Array.from( new Array( b > a ? b - a : a - b ), ( x, i ) => b > a ? i + a : a - i );


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [NumbersOCRService]
})
export class NumbersOCRModule {
    constructor(private serviceHttpFile:NumbersOCRService){
    }

    public decode(){
        let string_file = this.serviceHttpFile.getData();
    }
}
