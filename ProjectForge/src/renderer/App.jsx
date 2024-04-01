import drawBoundingBox from "./canvas/drawBoundingBox.js";
import { useState, useRef } from "react";
import { io } from "socket.io-client";
import getFrameData from "./canvas/getFrameData.js";
import { Button } from "@/components/ui/button";
import "./App.css";
import PlayerInfo from "./components/playerInfo.component.jsx";

const modelSocket = io("http://localhost:3000");
const clientSocket = io.connect("http://localhost:3030", {
  transports: ["websocket"],
});

function App() {
  const [currentWidth, setWidth] = useState(0);
  const [currentHeight, setHeight] = useState(0);
  const [isPredicting, setIsPredicting] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(null);
  const [cameraPosition, setCameraPosition] = useState(null);
  const [animation, setAnimation] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const dataRef = useRef(null);
  const imageCapture = useRef(null);
  const interval = useRef(null);
  const dataContext = useRef(null);
  const canvasContext = useRef(null);

  /**
   *
   */
  const handleStream = async () => {
    try {
      const video = videoRef.current;
      const id = await window.api.getSourceId();
      let stream = await navigator.mediaDevices.getUserMedia({
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
      imageCapture.current = new ImageCapture(videoTrack);
      dataContext.current = dataRef.current.getContext("2d", {
        willReadFrequently: true,
      });
      canvasContext.current = canvasRef.current.getContext("2d");
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Takes a frame from the data canvas and sends it to the ml server
   */
  const handlePrediction = async () => {
    if (imageCapture.current) {
      if (!interval.current) {
        interval.current = setInterval(async () => {
          const frame = await getFrameData(
            imageCapture.current,
            dataContext.current
          );
          modelSocket.emit("image", frame);
        }, 1000);
        setIsPredicting(true);
      } else {
        clearInterval(interval.current);
        interval.current = null;
        setIsPredicting(false);
      }
    }
  };

  /**
   * Draws bounding box on screen when a detection is found
   */
  modelSocket.on("BOUNDING_BOX", (filteredBoxes) => {
    if (canvasContext.current) {
      const { bounding, widthHeight } = filteredBoxes;
      drawBoundingBox(
        bounding,
        widthHeight,
        canvasContext.current,
        canvasRef.current
      );
    }
  });

  /**
   *
   * @param {camera:{x:string,y:string,yaw:string,pitch:string},player:{x:num,y:num},animation:num} data
   */
  const onData = (data) => {
    if (!data) {
      return;
    }
    const jsonData = JSON.parse(data);
    if (jsonData.hasOwnProperty("player")) {
      setPlayerPosition(jsonData.player);
    }
    if (jsonData.hasOwnProperty("camera")) {
      setCameraPosition(jsonData.camera);
    }
    if (jsonData.hasOwnProperty("animation")) {
      setAnimation(jsonData.animation);
    }
  };

  clientSocket.on("data", onData);

  return (
    <div className="flex flex-col">
      <div>
        <Button className="m-2" onClick={() => handleStream()}>
          Get Source
        </Button>
        <Button
          className={isPredicting ? "bg-red-700" : "bg-green-800"}
          onClick={() => handlePrediction()}
        >
          {isPredicting ? "Stop Prediction" : "Predict"}
        </Button>
      </div>
      <div>
        <PlayerInfo
          playerPosition={playerPosition}
          cameraPosition={cameraPosition}
          animation={animation}
        ></PlayerInfo>
      </div>
      <div>
        <div className="relative block bg-gray-600 w-full h-full">
          <canvas
            className="absolute top-0 left-0 z-10"
            ref={canvasRef}
            height={currentHeight}
            width={currentWidth}
          ></canvas>
          <video className="absolute top-0 left-0" ref={videoRef}></video>
        </div>
      </div>
      <canvas
        className="hidden"
        ref={dataRef}
        height={currentHeight}
        width={currentWidth}
      ></canvas>
    </div>
  );
}

export default App;
