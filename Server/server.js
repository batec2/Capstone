import {Worker,MessageChannel} from 'worker_threads';

const modelWorker = new Worker('./utils/tfModel.js');

/**
 * listens for a message from worker thread, and sends the resutls to
 * the front end to be rendered
 */
modelWorker.on('message',(results)=>{
    console.log(results.length);
    if(results){
        win.webContents.send('bounding box',results);
    }
    win.webContents.send('give-frame');
});

// import { Server } from "socket.io";

// const io = new Server(3001, {
//     maxHttpBufferSize: 1e8
// });

// console.log('go');

// io.on('connection', socket => {
//     console.log(socket.id);
//     socket.on('image',image=>{
//         console.log(image);
//         modelWorker.postMessage(image);
//     });
// });

// io.on('disconnect',()=>{
//     console.log('disconnected');
// });

// export LD_LIBRARY_PATH=/home/crush/.local/lib/python3.10/site-packages/nvidia/cudnn/lib/libcudnn.so.8:$LD_LIBRARY_PATH