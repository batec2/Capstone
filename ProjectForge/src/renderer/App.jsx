import drawBoundingBox from "./canvas/drawBoundingBox.js";
import { useState, useRef } from "react";
import { io } from "socket.io-client";
import getFrameData from "./canvas/getFrameData.js";
import { Button } from "@/components/ui/button";
import "./App.css";
import PlayerInfo from "./components/playerInfo/playerInfo.component.jsx";
import ScreenCapture from "./components/screenCapture/screenCapture.component.jsx";
import ExpCounter from "./components/expCounter/expCounter.jsx";

const modelSocket = io("http://localhost:3000");
const clientSocket = io.connect("http://localhost:3030", {
  transports: ["websocket"],
});

function App() {
  const [currentWidth, setWidth] = useState(0);
  const [currentHeight, setHeight] = useState(0);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [currentData, setData] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const dataRef = useRef(null);
  const mouseRef = useRef(null);
  const imageCapture = useRef(null);
  const interval = useRef(null);
  const dataContext = useRef(null);
  const canvasContext = useRef(null);

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };

  const drawMousePoints = () => {
    const height = currentHeight / 3 / 2;
    const width = currentWidth / 6;
    const left = currentWidth / 6;
    const top = currentHeight / 3;
    const right = (currentWidth / 6) * 4;

    if (mouseRef.current) {
      const ctx = mouseRef.current.getContext("2d");
      ctx.strokeStyle = "#ffe085";
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.2;
      ctx.strokeRect(
        currentWidth / 6, //x
        currentHeight / 3, //y
        (currentWidth / 6) * 4, //width
        currentHeight / 3 //height
      );
      ctx.strokeStyle = "#AAFF00";
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.5;
      ctx.strokeRect(
        getRandomInt(width) + left, //x
        getRandomInt(height) + (top + height), //y
        10, //width
        10 //height
      );
      ctx.strokeRect(
        getRandomInt(width) + right, //x
        getRandomInt(height) + top, //y
        10, //width
        10 //height
      );
    }
  };

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
        setIsCaptured(true);
      };
      imageCapture.current = new ImageCapture(stream.getVideoTracks()[0]);
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
    setData(JSON.parse(data));
  };

  clientSocket.on("data", onData);

  return (
    <div className="bg-red h-[900px]">
      <div className="flex flex-row">
        <Button
          className="m-2"
          onClick={() => (isCaptured ? {} : handleStream())}
        >
          {isCaptured ? "Source Captured" : "Get Source"}
        </Button>
        <Button
          className={isPredicting ? "bg-red-700 m-2" : "bg-green-800 m-2"}
          onClick={() => handlePrediction()}
        >
          {isPredicting ? "Stop Prediction" : "Predict"}
        </Button>
        <Button className="m-2" onClick={() => drawMousePoints()}>
          Draw Mouse Boxes
        </Button>
        <Button
          className={isBotRunning ? "bg-red-700 m-2" : "bg-green-800 m-2"}
          onClick={() => {
            setIsBotRunning((running) => !running);
            window.api.startStopBot();
          }}
        >
          {isBotRunning ? "Stop Bot" : "Start Bot"}
        </Button>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col">
          <PlayerInfo
            playerPosition={currentData ? currentData.player : null}
            cameraPosition={currentData ? currentData.camera : null}
            animation={currentData ? currentData.animation : null}
            isMoving={currentData ? currentData.moving : null}
          ></PlayerInfo>
        </div>
        {/* <video ref={videoRef}></video> */}
        <ScreenCapture
          canvasRef={canvasRef}
          videoRef={videoRef}
          dataRef={dataRef}
          mouseRef={mouseRef}
          currentHeight={currentHeight}
          currentWidth={currentWidth}
        ></ScreenCapture>
      </div>
      <ExpCounter exp={currentData ? currentData.exp : null}></ExpCounter>
    </div>
  );
}

export default App;
