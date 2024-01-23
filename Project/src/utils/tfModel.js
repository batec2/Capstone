import {parentPort} from 'worker_threads';
import * as tf from '@tensorflow/tfjs-node-gpu';
import * as tfTools from './tfTools.js';

const modelLocation = './model/yolov7_agility/weights/tf/agility_web_model/model.json';
const handler = tf.io.fileSystem(modelLocation);
const model = await tf.loadGraphModel(handler);

async function getPrediction(stream){
    await model.executeAsync(stream).then((output)=>{
        stream.dispose();
        tf.tidy(()=>{
            output.array().then((outputs)=>{
                console.log(`amount of outputs: ${outputs[0].length}`);
                const results = [];
                for(let i = 0;i<outputs[0].length;i++){
                    if (outputs[0][i][4]>=0.90){
                        results.push(outputs[0][i]);
                    }
                }
                console.log(results.length);
                parentPort.postMessage(results);
            });
            output.dispose();
        });
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

parentPort.on('message',async (image) => {
    tf.engine().startScope();
    const tensor = getTensor(image);
    await getPrediction(tensor);
    tf.engine().endScope();
    //console.log(tf.memory());
})