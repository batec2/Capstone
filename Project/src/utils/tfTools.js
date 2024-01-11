import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'node:fs';

function getTensorFromImageData(imageData,rank){
    const image = tf.browser.fromPixels(imageData,rank);
    // return resizeTensor(image);
    return image;
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
        .div(255.0)//normalizing tensor to floats between 0-1                  
        .transpose([2, 0, 1])
        .expandDims(0); 
    });
}

function saveImage(tensor){
    tf.node.encodePng(tensor).then((image)=>{
        fs.writeFileSync('redone.png',image);
        /*
        tf.node.encodePng(image).then((image)=>{
        })
        .catch((err)=>{
            console.log('Error at saveImage encodePng');
            console.log(err);
        });
        */
    })
    .catch((err)=>{
        console.log('Error at saveImage toPixel');
        console.log(err);
    });
}

export {getTensorFromFile,getTensorFromImageData, saveImage,resizeTensor};