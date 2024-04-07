/**
 * Takes the array of bounding boxes given by the model and draws it to a
 * canvas overlayed on the video stream.
 * @param {*} boundingArray
 * @param {*} widthHeight
 * @param {*} canvasContext
 */
const drawBoundingBox = (boundingArray, widthHeight, canvasContext, canvas) => {
  if (
    boundingArray.length === 0 ||
    widthHeight.length === 0 ||
    !canvas ||
    !canvasContext
  ) {
    return;
  }
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.strokeStyle = "#B033FF";
  canvasContext.lineWidth = 3;
  // Creates a rectangle for each prediction
  for (let i = 0; i < boundingArray.length; i++) {
    canvasContext.strokeRect(
      boundingArray[i][1], //x
      boundingArray[i][0], //y
      widthHeight[i][1], //width
      widthHeight[i][0] //height
    );
  }
};

export default drawBoundingBox;
