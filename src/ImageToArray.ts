import * as nj from '../bower_components/numjs/dist/numjs.min.js';

export function ImageToGrid(image){
    let output_matrix = nj.zeros([9,9]);
    let original_matrix = nj.images.read(image);
    let img_matrix = nj.images.resize(nj.images.rgb2gray(original_matrix),504,504);
    console.log(img_matrix);
    return output_matrix;
}