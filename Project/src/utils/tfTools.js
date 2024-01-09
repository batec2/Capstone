import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'node:fs';

function getTensorFromImageData(imageData,rank){
    const image = tf.browser.fromPixels(imageData,rank);
    return resizeTensor(image);
}

function getTensorFromFile(location,rank){
    const image = imageToTensor(location,rank);
    return resizeTensor(image);
}

function imageToTensor(location,rank){
    const image = fs.readFileSync(location);
    return tf.node.decodePng(image,rank);
}

function resizeTensor(image){
    return tf.tidy(()=>{
        return tf.image.resizeBilinear(image,[864,864])//resizing tensor to 864*864
        .div(255.0)                  
        .transpose([2, 0, 1])
        .expandDims(0); //normalizing tensor to floats between 0-1
    });
}

function drawImage(tensor){
    tf.node.encodePng(tensor,4).then((imageNew)=>{
        fs.writeFileSync('redone.png',imageNew);
    });
}

export {getTensorFromFile,getTensorFromImageData};