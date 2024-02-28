import "./App.css";
import drawBoundingBox from "./canvas/drawBoundingBox.js";
import setVideo from "./video/setVideo.react.js";
import { useState, useRef } from "react";
import { io } from "socket.io-client";
import getFrameData from "./canvas/getFrameData.js";

function App() {
  const [currentWidth, setWidth] = useState(0);
  const [currentHeight, setHeight] = useState(0);
  // window.api.drawBoundingBox(drawBoundingBox);
  const videoRef = useRef();
  const canvasRef = useRef();
  const dataRef = useRef();
  const socket = io("http://localhost:3000");
  // let sendData = false;
  let interval;
  let stream;
  let imageCapture;
  let dataContext;
  let canvasContext;

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
        setHeight(video.clientHeight);
        setWidth(video.clientWidth);
      };
      const videoTrack = stream.getVideoTracks()[0];
      imageCapture = new ImageCapture(videoTrack);
      dataContext = dataRef.current.getContext("2d", {
        willReadFrequently: true,
      });
      canvasContext = canvasRef.current.getContext("2d");
    } catch (err) {
      console.log(err);
    }
  };

  const handleFrame = async () => {
    if (imageCapture) {
      if (!interval) {
        interval = setInterval(async () => {
          const frame = await getFrameData(imageCapture, dataContext);
          socket.emit("image", frame);
        }, 2000);
      } else {
        clearInterval(interval);
        interval = null;
      }
    }
  };

  socket.on("BOUNDING_BOX", (filteredBoxes) => {
    if (canvasContext) {
      const { bounding, widthHeight } = filteredBoxes;
      drawBoundingBox(bounding, widthHeight, canvasContext, canvasRef.current);
    }
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
        <canvas
          className="overlay-canvas"
          ref={canvasRef}
          height={currentHeight}
          width={currentWidth}
        ></canvas>
        <video className="video-player" ref={videoRef}></video>
      </div>
      <canvas
        className="data-canvas"
        ref={dataRef}
        height={currentHeight}
        width={currentWidth}
      ></canvas>
    </div>
  );
}

export default App;
