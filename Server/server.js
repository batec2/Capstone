import { Worker, MessageChannel } from "worker_threads";
import { Server } from "socket.io";
import { predict, warmUpModel } from "./utils/tfModel.js";
import { splitResult } from "./utils/tfTools.js";
// const modelWorker = new Worker("./utils/tfModel.js");

const io = new Server(3005, {
  maxHttpBufferSize: 1e8,
});

console.log("go");

const model = await warmUpModel();

io.on("connection", async (socket) => {
  console.log(socket.id);
  socket.on("image", (image) => {
    const frame = {
      data: Array.from(image.data),
      width: image.width,
      height: image.height,
    };
    // modelWorker.postMessage(frame);
    const results = predict(frame, model);
    // console.log(results);
    if (results) {
      const slicedResults = splitResult(results);
      socket.emit("bounding", slicedResults);
    }
  });
  //   socket.emit("bounding", results);
  /**
   * listens for a message from worker thread, and sends the resutls to
   * the front end to be rendered
   */
  //   modelWorker.on("message", (results) => {
  //     console.log(results);
  //     // console.log(results.length);
  //     if (results) {
  //       socket.emit("bounding", results);
  //     }
  //   });
});

io.on("disconnect", () => {
  console.log("disconnected");
});

// export LD_LIBRARY_PATH=/home/crush/.local/lib/python3.10/site-packages/nvidia/cudnn/lib/libcudnn.so.8:$LD_LIBRARY_PATH
