import "./App.css";
import drawBoundingBox from "./canvas/drawBoundingBox.js";
import setVideo from "./video/setVideo.react.js";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import getFrameData from "./canvas/getFrameData.js";

function App() {
  // window.api.drawBoundingBox(drawBoundingBox);
  const videoRef = useRef();
  const canvasRef = useRef();
  const dataRef = useRef();
  const socket = io("http://localhost:3009");
  let stream;
  let imageCapture;
  let dataContext;

  const handleStream = async () => {
    try {
      const video = videoRef.current;
      const id = await window.api.getSourceId();
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: id,
          },
        },
      });
      video.srcObject = stream;
      video.onloadedmetadata = (e) => {
        video.play();
      };
      const videoTrack = stream.getVideoTracks()[0];
      imageCapture = new ImageCapture(videoTrack);
      dataContext = dataRef.current.getContext("2d", {
        willReadFrequently: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleFrame = async () => {
    if (imageCapture) {
      const frame = await getFrameData(imageCapture, dataContext);
      console.log(frame);
      socket.emit("image", frame);
    }
  };

  socket.on("BOUNDING_BOX", (boundingArray) => {
    console.log(boundingArray);
  });

  return (
    <div>
      <div className="button-box">
        <button className="get-source" onClick={() => handleStream()}>
          Get Source
        </button>
        <button onClick={() => handleFrame()}>Predict</button>
      </div>
      <div className="video-box">
        <video className="video-player Predictions" ref={videoRef}></video>
        <canvas className="overlay-canvas Predictions" ref={canvasRef}></canvas>
      </div>
      <canvas className="data-canvas" ref={dataRef}></canvas>
    </div>
  );
}

export default App;
