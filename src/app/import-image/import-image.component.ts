import { Component, ViewChild } from '@angular/core';
import * as nj from '../../../bower_components/numjs/dist/numjs.min.js';
import {ImageToArrayModule} from '../image-to-array/image-to-array.module';
import {SudokuSolverModule} from '../sudoku-solver/sudoku-solver.module';
//import {NumbersOCRModule} from '../numbers-ocr/numbers-ocr.module';
//import {NumbersOCRService} from '../numbers-ocr/numbers-ocr.service';

@Component({
  selector: 'app-import-image',
  templateUrl: './import-image.component.html',
  styleUrls: ['./import-image.component.css']
})
export class ImportImageComponent {

  @ViewChild('fileInput', {static: false})
  fileInput: any;
  file: File | null=null;
  my_matrix: Number[][]; //Sert seulement a initialiser la grille vide
  my_image: HTMLImageElement;
  imageToArrayModule: ImageToArrayModule;
  njMatrix: nj.NdArray;

  constructor(imageToArrayModule: ImageToArrayModule) {
    this.njMatrix = nj.zeros([9,9]);
    this.imageToArrayModule = imageToArrayModule;
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

  //Fonction qui analyse l'image et affiche la grille de depart
  fillGrid(){
    //Fonction appele quand on appui sur "Read grid"
    //Ici j'ai du separer les calculs et l'affichage en deux parties
    //Pour pouvoir afficher (raffraichir le html) apres chaque ligne (row)
    let temp_nj_matrix = nj.zeros([9,9]);
    let row = 0;
    let self = this;
    let work = function(){
        if (row < 9){
            temp_nj_matrix = self.imageToArrayModule.ImageToGrid(self.my_image,row);
            displayWork();
        }
    };
    let displayWork = function(){
        if (row < 9){
            for (let j = 0; j <9; j++){
                let num = temp_nj_matrix.get(row,j);
                self.njMatrix.set(row,j,num);
                let div = document.getElementById("index"+"-"+j+"-"+row);
                if (num != 0){
                    div.style.fontWeight = "900"; 
                    div.style.fontSize = "x-large"
                    div.innerHTML = num.toString();
                }else{
                    div.innerHTML = "";
                }
            }
            row++;
            setTimeout(work, 0);
        }
    };
    //Appel pour lancer le traitement de l'image
    work();
  }

  onClickImportImageButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeImportImage(): void {
    //Va chercher le fichier
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
    console.log(files[0])
    let reader = new FileReader();
    let canva = document.getElementById('imageDisplayArea') as HTMLCanvasElement;
    let ctx = canva.getContext("2d");
    let img = new Image();
    let reference_this = this;
    //Quand le filereader lie le fichier:
    reader.onload = function(e){
        //Quand l'objet image recoit un fichier
        img.onload=function(ev){
            ctx.drawImage(img,0,0,300,300);
            reference_this.my_image = img;

        }
        //L'objet image recoit la source
        img.src = reader.result.toString();        
    }
    //Le file reader recoit le fichier
    reader.readAsDataURL(files[0]);
  }


  //Fonction pour trouver et afficher la solution de la grille
  solveGrid(){
    let solver = new SudokuSolverModule(this.njMatrix);
    let solution = solver.getSolution()
    console.log(this.njMatrix.toString());
    for(let i = 0; i < 9; i++){
        for (let j = 0; j <9; j++){
            let num_original = this.njMatrix.get(i,j);
            let num = solution.get(i,j);
            let div = document.getElementById("index"+"-"+j+"-"+i);
            if (num_original != 0){
                div.style.fontWeight = "900"; 
                div.style.fontSize = "x-large";
                div.innerHTML = num.toString();
            }else{
                div.style.color = "rgb(94, 194, 23)";
                div.style.fontWeight = "900"; 
                div.style.fontSize = "x-large";
                div.innerHTML = num.toString();
            }
        }
    }
  }
}
