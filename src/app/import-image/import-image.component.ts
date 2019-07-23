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

  onClickImportImageButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeImportImage(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
    console.log(files[0])

    let reader = new FileReader();
    reader.onload = function(e){
        let imageDisplayArea = document.getElementById('imageDisplayArea');
        imageDisplayArea.setAttribute('src',reader.result.toString());

        //let fileDisplayArea = document.getElementById('fileDisplayArea');
        //let img = new Image();
        //img.src = reader.result.toString();
        //fileDisplayArea.appendChild(img);
    }
    reader.readAsDataURL(files[0]);
  }


  

}
