import { Worker, MessageChannel } from "worker_threads";
import { Server } from "socket.io";
import { predict, warmUpModel } from "./utils/tfModel.js";
import { nonMaxSuppression, splitResult } from "./utils/tfTools.js";

const io = new Server(3008, {
  maxHttpBufferSize: 1e8,
});

const model = await warmUpModel();

io.on("connection", async (socket) => {
  console.log(socket.id);
  socket.on("image", (image) => {
    const frame = {
      data: Array.from(image.data),
      width: image.width,
      height: image.height,
    };
    const results = predict(frame, model);
    // console.log(results);
    // console.log(frame);
    if (results) {
      const slicedResults = splitResult(results);
      nonMaxSuppression(results);
      socket.emit("bounding", slicedResults);
    }
  });
});

io.on("disconnect", () => {
  console.log("disconnected");
});
