import * as tf from '@tensorflow/tfjs-node-gpu';
import * as fs from 'node:fs';

/**
 * 
 * @param {*} imageData 
 * @param {*} rank 
 * @returns 
 */
function getTensorFromImageData(imageData,rank){
    return tf.browser.fromPixels(imageData,rank);
}

/**
 * 
 * @param {*} location 
 * @param {*} rank 
 * @returns 
 */
function getTensorFromFile(location,rank){
    const image = imageToTensor(location,rank);
    return resizeTensor(image);
}

/**
 * 
 * @param {*} location 
 * @param {*} rank 
 * @returns 
 */
function imageToTensor(location,rank){
    const image = fs.readFileSync(location);
    return tf.node.decodePng(image,rank);
}

function nonMaxSuppression(box,score){

}

/**
 * Saves a tensor to a png file
 * @param {*} tensor 
 */
function saveImage(tensor){
    tf.node.encodePng(tensor).then((image)=>{
        fs.writeFileSync('redone.png',image);
    })
    .catch((err)=>{
        console.log('Error at saveImage toPixel');
        console.log(err);
    });
}

/**
 * Resizes image tensor by padding tensor to the shape of 864x864
 * @param {*} image 
 * @returns 
 */
function resizeTensor(image){
    const height = image.shape[1];
    const width = image.shape[0];
    let img;
    if(image.height<=864 && image.width<=864){
        img = image.pad([[0,864-width],[0,864-height],[0,0]])//pads image to 864,864
        .div(255.0)//normalizing tensor to floats between 0-1                  
        .transpose([2, 0, 1])//no idea, something about turning rows into columns?
        .expandDims(0);//it expands dimensions?
    }
    return img;//[1,3,864,864] rank of 4 (4d array) to match model requirements
}

export {getTensorFromFile,getTensorFromImageData,resizeTensor,saveImage};