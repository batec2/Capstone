import * as tf from '@tensorflow/tfjs-node';

function getPrediction(stream){
    //const modelLocation = 'D:/Github/yolov7/runs/train/trainingV1/exp7/weights/tf/agility_web_model/model.json';
    const modelLocation = '../Project/model/yolov7_agility/weights/tf/agility_web_model/model.json';
    const handler = tf.io.fileSystem(modelLocation);
    tf.loadGraphModel(handler).then((loaded)=>{
        loaded.executeAsync(stream).then((output)=>{
            output.array().then((outputs)=>{
                console.log(outputs[0].length);
                for(let i = 0;i<outputs[0].length;i++){
                    if (outputs[0][i][4]>=0.80){
                        console.log(outputs[0][i]);
                    }
                }
            })
        })
        .catch((reject)=>{
            console.log('---Error At Execute---');
            console.log(reject);
        });
    })
    .catch((reject)=>{
        console.log('---Error at Load Graph---');
        console.log(reject);
    });
}

export {getPrediction};