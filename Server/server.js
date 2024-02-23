import { Worker, MessageChannel } from "worker_threads";
import { Server } from "socket.io";
import { predict, warmUpModel } from "./utils/tfModel.js";
import { nonMaxSuppression, splitResult } from "./utils/tfTools.js";

const io = new Server(3009, {
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
    if (results) {
      const { bounding, widthHeight, scores, detectionClass } =
        splitResult(results);
      const nms = nonMaxSuppression(results);
      const filteredBoxes = {
        bounding: [],
        widthHeight: [],
        scores: [],
        detectionClass: [],
      };
      for (const index in nms) {
        filteredBoxes.bounding.push(bounding[index]);
        filteredBoxes.widthHeight.push(widthHeight[index]);
        filteredBoxes.scores.push(scores[index]);
        filteredBoxes.detectionClass.push(detectionClass[index]);
      }
      socket.emit("bounding", filteredBoxes);
    }
  });
});

io.on("disconnect", () => {
  console.log("disconnected");
});
