import * as nj from '../bower_components/numjs/dist/numjs.min.js';
import {NumbersOCRModule} from './app/numbers-ocr/numbers-ocr.module';

//Foncion range similaire a celle de python
const range = ( a , b ) => Array.from( new Array( b > a ? b - a : a - b ), ( x, i ) => b > a ? i + a : a - i );

export function ImageToGrid(image){
    let output_matrix = nj.ones([9,9]);
    let original_matrix = nj.images.read(image);
    let img_matrix = nj.images.rgb2gray(original_matrix);
    let max_size = Math.min(img_matrix.shape[0],img_matrix.shape[1]);
    if (max_size > 504){ max_size = 504;}
    img_matrix = nj.images.resize(img_matrix,max_size,max_size);

    /*let $test = document.getElementById("test") as HTMLCanvasElement;
    $test.width = img_matrix.shape[1];$test.height = img_matrix.shape[0];
    nj.images.save(img_matrix,$test);*/

    let width = img_matrix.shape[1];
    let height = img_matrix.shape[0];
    let interval = Math.round(width/9);
    let semi_interval = Math.round(interval/2);
    let quart_interval = Math.round(interval/3);

    for (let i of range(0,9)){
        let my_string = "";
        for (let j of range(0,9)){
            let centrex = semi_interval + j*interval
            let centrey = semi_interval + i*interval
            let xinf = centrex-quart_interval
            let xsup = centrex+quart_interval
            let yinf = centrey-quart_interval
            let ysup = centrey+quart_interval

            //Verifier si la case est vide
            let img_case = img_matrix.slice([yinf,ysup],[xinf,xsup]);
            if (img_case.mean() > 240){ //La case est composee de pixels blancs (blanc = 255)
                my_string += " x";
                output_matrix.set(i,j,0);
            }else{
                
                //La case n'est pas vide, on recadre l'image pour mieux l'analyser
                let bornes = fitCase(img_case);
                let img_case_cropped = img_case.slice(bornes[1],bornes[0]);
                let width_cropped = img_case_cropped.shape[1];
                //Etire la case pour avoir une hauteur de 28 sans élargir
                img_case_cropped = nj.images.resize(img_case_cropped,28,width_cropped);
                //Ajoute les bandes verticales de pixels blancs pour avoir une largeur de 28
                let img_case_final = ajusteLargeur(img_case_cropped);
                //Appel le OCR pour detecter le chiffre
                let num = 1; //Appel OCR
                my_string += " " + num.toString();
                output_matrix.set(i,j,num);


                //Display test
                let $test = document.getElementById("test") as HTMLCanvasElement;
                $test.width = img_case_final.shape[1];$test.height = img_case_final.shape[0];
                nj.images.save(img_case_final,$test);
            }
        }
    }
    return output_matrix;
}

//Pour que l'image contienne seulement le chiffre
function fitCase(matrice){
    let width = matrice.shape[0]; //Ici ils sont inversé mais c'est correct
    let height = matrice.shape[1]; //C'est une erreur que j'avais dans mon code python

    let percent = 0.3;
    let percent_height = 0.55;
    let yinf = 0;
    let ysup=height;
    let found = false;
    
    //Borne inferieure
    for (let j of range(0,Math.round(percent_height*height))){
        if (found) { break; }
        for (let i of range(Math.round(percent*width),Math.round((1-percent)*width))){
            if (matrice.get(j,i)<200){
                yinf = j;
                found=true;
                break;
            }
        }
    }
    //Borne superieure
    found = false;
    for (let j of range(height-1,Math.round((1-percent_height)*height))){
        if (found) { break; }
        for (let i of range(Math.round(percent*width),Math.round((1-percent)*width))){
            if (matrice.get(j,i)<200){
                ysup = j;
                found=true;
                break;
            } 
        }
    }
    //Borne gauche
    let xinf = 0;
    let xsup = width;
    found = false;
    let percent_width = 0.55;
    for (let i of range(0,Math.round(percent_width*width))){
        if (found) {break;}
        for(let j of range(Math.round(percent*height),Math.round((1-percent)*height))){
            if (matrice.get(j,i)<200){
                xinf = i;
                found=true;
                break;
            } 
        }
    }
    //Borne droite
    found = false;
    for (let i of range(width-1,Math.round((1-percent_width)*width))){
        if (found) {break;}
        for(let j of range(Math.round(percent*height),Math.round((1-percent)*height))){
            if (matrice.get(j,i)<200){
                xsup = i;
                found=true;
                break;
            } 
        }
    }
    return [[xinf-2,xsup+2],[yinf,ysup]];

}

//Ajoute des pixels blancs pour que la largeur soit de 28
function ajusteLargeur(matrice){
    let new_matrice = matrice.clone();
    let width = new_matrice.shape[1];
    let nb = 28-width;
    let white_col = nj.ones(28);
    for (let i of range(0,28)) {
        white_col.set(i,255);
    }
    white_col = white_col.reshape(28,1);
    while (nb>0){
        new_matrice = nj.concatenate(white_col,new_matrice);
        nb-=1;
        if(nb>0){
            new_matrice = nj.concatenate(new_matrice,white_col);
            nb-=1
        }
    }
    return new_matrice
}