import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-import-image',
  templateUrl: './import-image.component.html',
  styleUrls: ['./import-image.component.css']
})
export class ImportImageComponent {

  @ViewChild('fileInput', {static: false})
  fileInput: any;
  file: File | null=null;
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
    //Quand le filereader lie le fichier:
    reader.onload = function(e){
        let img = new Image();
        //Quand l'objet image recoit un fichier
        img.onload=function(ev){
            ctx.drawImage(img,0,0,300,300);
        }
        //L'objet image recoit la source
        img.src = reader.result.toString();        
    }
    //Le file reader recoit le fichier
    reader.readAsDataURL(files[0]);
  }


  

}
