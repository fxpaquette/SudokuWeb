import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-grid',
  templateUrl: './display-grid.component.html',
  styleUrls: ['./display-grid.component.css']
})
export class DisplayGridComponent implements OnInit {

    my_matrix: Number[][];
    constructor() {
        //Matrice de test
        this.my_matrix = new Array<Array<Number>>();
        for (let i = 0; i < 9; i++) {
            let row:Number[]  = new Array<Number>();      
            for (let j = 0; j <9; j++){
                row.push(new Number(i*j));
            }
            this.my_matrix.push(row);
        }
    }

    fillGrid(){
        for(let i = 0; i < 9; i++){
            for (let j = 0; j <9; j++){
                document.getElementById("index"+"-"+i+"-"+j).innerHTML = this.my_matrix[i][j].toString();
            }
        }
    }

  ngOnInit() {
  }

}
