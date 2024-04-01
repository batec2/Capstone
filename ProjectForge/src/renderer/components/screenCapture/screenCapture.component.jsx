import { useEffect, useRef } from "react";

const ScreenCapture = ({
  canvasRef,
  currentHeight,
  currentWidth,
  videoRef,
  dataRef,
  mouseRef,
}) => {
  return (
    <div>
      <div>
        <div className="relative block bg-gray-600 w-full h-full">
          <canvas
            className="absolute top-0 left-0 z-10"
            ref={canvasRef}
            height={currentHeight}
            width={currentWidth}
          ></canvas>
          <canvas
            className="absolute top-0 left-0 z-20"
            ref={mouseRef}
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
};

export default ScreenCapture;
