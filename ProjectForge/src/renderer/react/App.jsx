import "./App.css";
import drawBoundingBox from "../canvas/drawBoundingBox";
import setVideo from "../video/setVideo.react.js";
import { useEffect, useRef } from "react";
function App() {
  window.api.drawBoundingBox(drawBoundingBox);
  const videoRef = useRef(null);

  const handleStream = async () => {
    const id = await window.api.getSourceId();
    setVideo(id, videoRef);
  };

  return (
    <div>
      <div className="button-box">
        <button className="get-source" onClick={() => handleStream()}>
          Get Source
        </button>
      </div>
      <div className="video-box">
        <video
          className="video-player Predictions"
          ref={videoRef}
          // src={currentStream}
        ></video>
        <canvas className="overlay-canvas Predictions"></canvas>
      </div>

      <canvas className="data-canvas"></canvas>
    </div>
  );
}

export default App;
