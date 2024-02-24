/**
 * Takes a imageCapture object to take a frame from a video stream and draws it
 * the frame to a canvas inorder to extract image data from the frame
 * @param {imageCapture} imageCapture
 * @param {CanvasRenderingContext2D} canvasContext
 * @returns
 */
const getFrameData = async (imageCapture, canvasContext) => {
  try {
    // takes a frame from the video stream to send to the main thread
    const imageBitmap = await imageCapture.grabFrame();
    canvasContext.drawImage(imageBitmap, 0, 0);
    // takes the imageData from the canvas
    const frameData = canvasContext.getImageData(
      0, //top left x
      0, //top right x
      imageBitmap.width,
      imageBitmap.height
    );

    return {
      data: frameData.data,
      width: frameData.width,
      height: frameData.height,
    };
  } catch (err) {
    console.log(err);
  }
};

export default getFrameData;
