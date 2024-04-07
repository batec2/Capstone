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
    <>
      <div className="relative block w-full">
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
      <canvas
        className="hidden"
        ref={dataRef}
        height={currentHeight}
        width={currentWidth}
      ></canvas>
    </>
  );
};

export default ScreenCapture;
