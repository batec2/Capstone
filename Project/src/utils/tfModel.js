import {parentPort} from 'worker_threads';
import * as tf from '@tensorflow/tfjs-node-gpu';
import * as tfTools from './tfTools.js';

const modelLocation = './model/yolov7_agility/weights/tf/agility_web_model/model.json';
const handler = tf.io.fileSystem(modelLocation);
const model = await tf.loadGraphModel(handler);

function getPrediction(stream){
    model.executeAsync(stream).then((output)=>{
        stream.dispose();
        output.array().then((outputs)=>{
            console.log(outputs[0].length);
            for(let i = 0;i<outputs[0].length;i++){
                if (outputs[0][i][4]>=0.80){
                    console.log(outputs[0][i]);
                }
            }
        })
        output.dispose();
        console.log(tf.memory());
    })
    .catch((reject)=>{
        console.log('---Error At Execute---');
        console.log(reject);
    });
}

function getTensor(image){
    return tf.tidy(()=>{
        const imageObject = {data:Uint8Array.from(image), width: 864, height: 864};
        const tensor = tfTools.getTensorFromImageData(imageObject,3);
        return tfTools.resizeTensor(tensor);
    });
}

parentPort.on('message',(image) => {
    const tensor = getTensor(image);
    getPrediction(tensor);
    parentPort.postMessage('finished');
})