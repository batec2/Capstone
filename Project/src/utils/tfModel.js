import {parentPort} from 'worker_threads';
import * as tf from '@tensorflow/tfjs-node-gpu';
import * as tfTools from './tfTools.js';

const modelLocation = './model/yolov7_agility/weights/tf/agility_web_model/model.json';
const handler = tf.io.fileSystem(modelLocation);
const model = await tf.loadGraphModel(handler);

const dummyInput = tf.ones(model.inputs[0].shape);
const warmupResult = model.execute(dummyInput);
tf.dispose(warmupResult);
tf.dispose(dummyInput);

/**
 * Takes a frame from the main thread and uses the model to inference
 * @param {} frame 
 */
function getPrediction(frame){
    const output = model.execute(frame);
    const boundingArrays = output.arraySync();
    const results = [];
    for(let i = 0;i<boundingArrays[0].length;i++){
        if (boundingArrays[0][i][4]>=0.90){
            results.push(boundingArrays[0][i]);
        }
    }
    console.log(results.length);
    parentPort.postMessage(results);
}

/**
 * Takes a frame and converts to a tensor of size 864*864 for inference
 * @param {*} frame 
 * @returns 
 */
function getTensor(frame){
    return tf.tidy(()=>{
        const imageObject = {data:Uint8Array.from(frame), width: 864, height: 864};
        const tensor = tfTools.getTensorFromImageData(imageObject,3);
        return tfTools.resizeTensor(tensor);
    });
}

parentPort.on('predict image',(image) => {
    tf.engine().startScope();
    const tensor = getTensor(image);
    getPrediction(tensor);
    tf.engine().endScope();
    //console.log(tf.memory());
})