import * as tf from '@tensorflow/tfjs-node-gpu';
import * as fs from 'node:fs';

function getTensorFromImageData(imageData,rank){
    return tf.browser.fromPixels(imageData,rank);
}

function getTensorFromFile(location,rank){
    const image = imageToTensor(location,rank);
    return resizeTensor(image);
}

function imageToTensor(location,rank){
    const image = fs.readFileSync(location);
    return tf.node.decodePng(image,rank);
}


function saveImage(tensor){
    tf.node.encodePng(tensor).then((image)=>{
        fs.writeFileSync('redone.png',image);
    })
    .catch((err)=>{
        console.log('Error at saveImage toPixel');
        console.log(err);
    });
}

function resizeTensor(image){
    const height = image.shape[1];
    const width = image.shape[0];
    let img = image.pad([[0,864-width],[0,864-height],[0,0]])//pads image to 864,864
        .div(255.0)//normalizing tensor to floats between 0-1                  
        .transpose([2, 0, 1])//no idea, something about turning rows into columns?
        .expandDims(0);//it expands dimensions?
    return img;//[1,3,864,864] rank of 4 (4d array) to match model requirements
}

export {getTensorFromFile,getTensorFromImageData,resizeTensor,saveImage};