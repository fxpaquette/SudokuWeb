import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import * as nj from '../../../bower_components/numjs/dist/numjs.min.js';
import {NumbersOCRService} from './numbers-ocr.service';
import { Observable } from 'rxjs/internal/Observable';
import { NjArray } from 'numjs';

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
    nb_attributs: number;
    nb_couches: number;
    nb_neurones: number;
    nb_class: number;
    liste_couches: Array<nj.NdArray>;

    constructor(private serviceHttpFile:NumbersOCRService){
        this.nb_couches = 3;
        this.nb_neurones = 800;
        this.serviceHttpFile.getData().subscribe(data => {console.log(data); this.decode(data);});
    }

    public decode(data: string){
        let list_lines = data.split(/\r\n|\r|\n/);
        this.nb_attributs = Number(list_lines[0]);
        this.nb_class = Number(list_lines[2]);
        let liste_couche1 = list_lines[4].split(' ');
        liste_couche1.shift();//Car JS met un element vide au debut
        console.log(liste_couche1);
        this.liste_couches = [];
        this.liste_couches.push(nj.zeros([this.nb_neurones,this.nb_attributs]));
        //Premiere couche
        let compteur = 0;
        for (let i of range(0,this.nb_neurones)){
            for (let j of range(0,this.nb_attributs)){
                this.liste_couches[0].set(i,j,Number(liste_couche1[compteur]));
                compteur++;
            }
        }
        //Autres couches
        if (this.nb_couches>3){
            for (let k of range(1,this.nb_couches-2)){
                let liste_couchek = list_lines[2*k+4].split(' ');
                this.liste_couches.push(nj.zeros([this.nb_neurones,this.nb_neurones]));
                compteur = 0
                for (let i of range(0,this.nb_neurones)){
                    for (let j of range(0,this.nb_neurones)){
                        this.liste_couches[k].set(i,j,Number(liste_couchek[compteur]));
                        compteur++;
                    }
                }
            }
        }
        //Derniere couche
        let liste_couchek = list_lines[list_lines.length-3].split(' ');
        liste_couchek.shift();//Car JS met un element vide au debut
        console.log(liste_couchek);
        //Si on a 2 classes il y a juste une sortie
        let nb_classes_temp = 1;
        if (this.nb_class>2){
            nb_classes_temp = this.nb_class;
        }
        this.liste_couches.push(nj.zeros([nb_classes_temp,this.nb_neurones]));
        compteur =0;
        for (let i of range(0,nb_classes_temp)){
            for(let j of range(0,this.nb_neurones)){
                this.liste_couches[this.liste_couches.length-1].set(i,j,Number(liste_couchek[compteur]));
                compteur++;
            }
        }
        console.log("Nb class",this.nb_class)
        console.log("Nb attributs",this.nb_attributs)
        console.log(this.liste_couches);
        console.log("Decode is done");
    }

    private sigmoid(y){
        return 1/(1+Math.exp(-y));
    }

    private sommeprod(vec1,vec2){
        let somme =0;
        for (let i of range(0,vec1.length)){
            somme += vec1[i]*vec2[i];
        }
        return somme;
    }

    private indexOfMax(arr: Array<number>) {
        var max = arr[0];
        var maxIndex = 0;
    
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                maxIndex = i;
                max = arr[i];
            }
        }
    
        return maxIndex;
    }

    public predict(example){
        let noeuds_precedent = example.flatten().tolist();
        //Binarization de l'image
        for (let pixel of noeuds_precedent){
            if (pixel > 127){ pixel = 1; }
            else{ pixel = 0; }
        }
        for (let i of range(0,this.nb_couches-2)){
            let noeus_nouveaux = [];
            for (let j of range(0,this.nb_neurones)){
                let vec_weights = this.liste_couches[i].slice([j,j+1]).flatten().tolist();
                noeus_nouveaux.push(this.sigmoid(this.sommeprod(vec_weights,noeuds_precedent)));
            }
            noeuds_precedent = Array.from(noeus_nouveaux);
        }
        //Calcul valeurs a la sortie
        let output = 99;
        if (this.nb_class == 2){
            let vec_weights = this.liste_couches[this.liste_couches.length-1].slice([0,1]).flatten().tolist();
            output = Math.round(this.sigmoid(this.sommeprod(vec_weights,noeuds_precedent)));
        }else{
            let output_vec = [];
            for (let j of range(0,this.nb_class)){
                let vec_weights = this.liste_couches[this.liste_couches.length-1].slice([j,j+1]).flatten().tolist();
                output_vec.push(this.sigmoid(this.sommeprod(vec_weights,noeuds_precedent)));
            }
            console.log(output_vec.toString());
            output = this.indexOfMax(output_vec);
        }
        return output
    }
}
