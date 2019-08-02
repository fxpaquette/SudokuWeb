import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DancingLinksXModule} from '../dancing-links-x/dancing-links-x.module'
import * as nj from '../../../bower_components/numjs/dist/numjs.min.js';

//Foncion range similaire a celle de python
const range = ( a , b ) => Array.from( new Array( b > a ? b - a : a - b ), ( x, i ) => b > a ? i + a : a - i );



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SudokuSolverModule { 
    grid: nj.NdArray;
    matrix: nj.NdArray;

    constructor(grid) {
        this.grid = grid;
    }
    generateMatrix(){
        this.matrix = nj.zeros([729,324]);
        for(let row of range(0,9)){
            for (let col of range(0,9)){
                let rows_start = (row*81 + col*9)
                let rows_end = rows_start + 9
                let range_rows = range(rows_start,rows_end)
                //Row-Column Constraint
                let cols_start = row*9 + col
                for(let i of range_rows){
                    this.matrix.set(i,cols_start,1);
                }
                //Row-Number Constraints
                cols_start = 81+row*9
                for (let i of range(0,9)){
                    this.matrix.set(range_rows[i],cols_start+i,1);
                }
                //Column-Number Constraints
                cols_start = 162+col*9
                for (let i of range(0,9)){
                    this.matrix.set(range_rows[i],cols_start+i,1);
                }
                //Box-Number Constraints
                let box = this.getBox(row,col)
                cols_start = 243+box*9
                for (let i of range(0,9)){
                    this.matrix.set(range_rows[i],cols_start+i,1);
                }
            }
        }
        for(let row of range(0,9)){
            for (let col of range(0,9)){
                let val = this.grid.get(row,col);
                if(val!=0){
                    let rows_start = (row*81 + col*9)
                    let rows_end = rows_start + 9
                    let range_rows = range(rows_start,rows_end)
                    //Row-Column Constraint
                    //Toute les rows correspondant a la cellule sont mise a 0, sauf pour la valeur
                    for (let i of range(1,10)){
                        if (i!=val){
                            for(let j of range(0,324)){
                                this.matrix.set(rows_start+i-1,j,0);
                            }
                        }                    
                    }
                    //Row-Number Constraints
                    let cols_start = 81+(row*9)+val-1
                    for(let j of range(0,729)){
                        this.matrix.set(j,cols_start,0);
                    }
                    this.matrix.set(rows_start+val-1,cols_start,1);
                    //--------------------------------------------
                    let rows_start_2 = row*81 + val-1
                    for (let i of range(0,9)){
                        if (col != i){
                            for(let j of range(0,324)){
                                this.matrix.set(rows_start_2 + i*9,j,0);
                            }
                        }
                    }
                            //Column-Number Constraints
                    cols_start = 162+(col*9)+val-1
                    for(let j of range(0,729)){
                        this.matrix.set(j,cols_start,0);
                    }
                    this.matrix.set(rows_start+val-1,cols_start,1);
                    //--------------------------------------------
                    rows_start_2 = col*9 + val -1
                    for (let i of range(0,9)){
                        if (row != i){
                            for(let j of range(0,324)){
                                this.matrix.set(rows_start_2 + i*81,j,0);
                            }
                        }
                    }
                            //Box-Number Constraints
                    let box = this.getBox(row,col)
                    cols_start = 243+box*9+val-1
                    for(let j of range(0,729)){
                        this.matrix.set(j,cols_start,0);
                    }
                    this.matrix.set(rows_start+val-1,cols_start,1);
                }
            }
        }
    }

    getBox(row,col){
        return (Math.floor(row/3)*3)+Math.floor(col/3)
    }

    convertSolutionRows(rows){
        let output_matrix = nj.zeros([9,9]);
        for (let row_sol of rows){
            //rows contient les position des rows qui font partie de la solution
            //Les 3 operations permettent de retrouver a quel row-col-number constraint ils font reference
            let row = Math.floor(row_sol/81); //Division entiere
            let col = Math.floor((row_sol%81)/9);
            let num = (row_sol%81)%9 + 1;
            output_matrix.set(row,col,num);
        }
        return output_matrix;
    }

    getSolution(){
        this.generateMatrix();
        let solver = new DancingLinksXModule(this.matrix);
        let rows_solution = solver.runDLX();
        console.log("Rows_solution",rows_solution);
        let sol = this.convertSolutionRows(rows_solution);
        return sol;
    }

}
