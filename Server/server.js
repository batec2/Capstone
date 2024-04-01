import { Worker, MessageChannel } from "worker_threads";
import { Server } from "socket.io";
import { predict, warmUpModel } from "./utils/tfModel.js";
import { nonMaxSuppression, splitResult } from "./utils/tfTools.js";
import express from "express";
import cors from "cors";

// const app = express();

const io = new Server(3000, {
  cors: {
    origin: "*",
  },
  maxHttpBufferSize: 1e8,
});

const model = await warmUpModel();

io.on("connection", async (socket) => {
  console.log(socket.id);
  socket.on("image", (image) => {
    console.log("predicting...");
    if (!image) {
      return;
    }
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
      // only send if there are detected items
      console.log(filteredBoxes.bounding);
      io.emit("BOUNDING_BOX", filteredBoxes);
    }
  });
});

io.on("disconnect", () => {
  console.log("disconnected");
});
