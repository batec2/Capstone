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

function resizeTensor(image){
    let img = tf.image//image is [864,864,3] rank of 3 (3d array)
        .resizeBilinear(image,[864,864])//resizes to a 864x864 (shouldn't need to do this tho since input is already 864x864, but ok?)
    saveImage(img);

    img =img.div(255.0)//normalizing tensor to floats between 0-1                  
        .transpose([2, 0, 1])//no idea, something about turning rows into columns?
        .expandDims(0);//it expands dimensions?
    return img;//[1,3,864,864] rank of 4 (4d array) to match model requirements
}

export {getTensorFromFile,getTensorFromImageData,resizeTensor,saveImage};